import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import rateLimit from 'express-rate-limit';

// Rate limiting specifically for file access
const fileAccessLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 file requests per windowMs
  message: {
    success: false,
    error: {
      message: 'Too many file requests from this IP, please try again later.',
      code: 'FILE_ACCESS_RATE_LIMIT_EXCEEDED'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting in development
  skip: (req) => {
    return process.env.NODE_ENV === 'development';
  }
});

// Security middleware for path traversal protection
const validateFilePath = (uploadDir: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requestedPath = req.path;

      // Check if path starts with '/' before using substring
      if (!requestedPath || !requestedPath.startsWith('/')) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Access denied: Invalid path format',
            code: 'INVALID_PATH_FORMAT'
          }
        });
        return;
      }

      // Decode URI component to handle encoded characters
      const decodedPath = decodeURIComponent(requestedPath);

      // Apply Unicode normalization to prevent bypass attempts
      const normalizedPath = decodedPath.normalize('NFC');

      // Check for path traversal attempts
      if (normalizedPath.includes('..') ||
          normalizedPath.includes('\\') ||
          normalizedPath.includes('\0') ||
          normalizedPath.includes('%2e%2e') ||
          normalizedPath.includes('%2f%2e%2e') ||
          normalizedPath.includes('%5c')) {
        res.status(403).json({
          success: false,
          error: {
            message: 'Access denied: Invalid file path',
            code: 'INVALID_FILE_PATH'
          }
        });
        return;
      }

      // Resolve the full path and ensure it's within the upload directory
      // Now safe to use substring(1) since we verified path starts with '/'
      const fullPath = path.resolve(uploadDir, normalizedPath.substring(1));
      const uploadDirResolved = path.resolve(uploadDir);

      if (!fullPath.startsWith(uploadDirResolved)) {
        res.status(403).json({
          success: false,
          error: {
            message: 'Access denied: Path outside allowed directory',
            code: 'PATH_OUTSIDE_DIRECTORY'
          }
        });
        return;
      }

      // Use async file system calls to prevent blocking the event loop
      try {
        await fsPromises.access(fullPath, fs.constants.F_OK);
        const stats = await fsPromises.stat(fullPath);

        if (!stats.isFile()) {
          res.status(403).json({
            success: false,
            error: {
              message: 'Access denied: Not a file',
              code: 'NOT_A_FILE'
            }
          });
          return;
        }
      } catch (fileError) {
        // File doesn't exist or can't be accessed - let express.static handle it
        // This is not necessarily an error, express.static will return 404
      }

      next();
    } catch (error) {
      console.error('File path validation error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error during file validation',
          code: 'FILE_VALIDATION_ERROR'
        }
      });
      return;
    }
  };
};

// Security headers middleware for file responses
const setSecurityHeaders = (req: Request, res: Response, next: NextFunction): void => {
  // Set security headers for file responses
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy for images
  res.setHeader('Content-Security-Policy', "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'");
  
  // Cache control for uploaded files
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // 1 year cache
  } else {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  }

  next();
};

// File type validation middleware
const validateFileType = (req: Request, res: Response, next: NextFunction): void => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];

  const requestedPath = req.path;
  const fileExtension = path.extname(requestedPath).toLowerCase();
  
  // Check file extension
  if (!allowedExtensions.includes(fileExtension)) {
    res.status(403).json({
      success: false,
      error: {
        message: 'Access denied: File type not allowed',
        code: 'INVALID_FILE_TYPE'
      }
    });
    return;
  }

  // For additional security, we could check MIME type from file content
  // but for now, extension check is sufficient for uploaded images

  next();
  return;
};

// Main secure static files middleware
export const secureStaticFiles = (uploadDir: string) => {
  const staticMiddleware = express.static(uploadDir, {
    // Disable directory listing
    index: false,
    // Set proper MIME types
    setHeaders: (res, filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      switch (ext) {
        case '.jpg':
        case '.jpeg':
          res.setHeader('Content-Type', 'image/jpeg');
          break;
        case '.png':
          res.setHeader('Content-Type', 'image/png');
          break;
        case '.gif':
          res.setHeader('Content-Type', 'image/gif');
          break;
        case '.webp':
          res.setHeader('Content-Type', 'image/webp');
          break;
        case '.svg':
          res.setHeader('Content-Type', 'image/svg+xml');
          break;
        default:
          res.setHeader('Content-Type', 'application/octet-stream');
      }
    }
  });

  // Return middleware stack
  return [
    fileAccessLimiter,
    validateFilePath(uploadDir),
    validateFileType,
    setSecurityHeaders,
    staticMiddleware
  ];
};
