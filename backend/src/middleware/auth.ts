import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/auth.js';
import { AuthenticationError, AuthorizationError } from '../utils/errors.js';
import { UserRole, JWTPayload } from '../types/index.js';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    const payload = verifyToken(token);
    req.user = payload;

    // Log successful authentication in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Authentication successful:', {
        userId: payload.userId,
        role: payload.role,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString()
      });
    }

    next();
  } catch (error) {
    // Enhanced error logging for authentication failures
    console.error('Authentication failed:', {
      error: error instanceof Error ? error.message : String(error),
      url: req.url,
      method: req.method,
      authHeader: req.headers.authorization ? 'present' : 'missing',
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString()
    });

    next(new AuthenticationError('Invalid or expired token'));
  }
};

export const requireAdmin = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    return next(new AuthenticationError('Authentication required'));
  }

  if (req.user.role !== UserRole.ADMIN) {
    return next(new AuthorizationError('Admin access required'));
  }

  next();
};

export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = extractTokenFromHeader(authHeader);
      const payload = verifyToken(token);
      req.user = payload;
    }
    next();
  } catch (error) {
    // For optional auth, we don't throw errors, just continue without user
    next();
  }
};
