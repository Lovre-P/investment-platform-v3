import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal server error';
  let code = 'INTERNAL_ERROR';

  // Handle operational errors
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code || 'OPERATIONAL_ERROR';
  }
  
  // Handle specific error types
  else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = error.message;
    code = 'VALIDATION_ERROR';
  }
  
  // Handle JWT errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    code = 'INVALID_TOKEN';
  }
  
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    code = 'TOKEN_EXPIRED';
  }
  
  // Handle database errors
  else if (error.message.includes('duplicate key')) {
    statusCode = 409;
    message = 'Resource already exists';
    code = 'DUPLICATE_RESOURCE';
  }
  
  else if (error.message.includes('foreign key')) {
    statusCode = 400;
    message = 'Invalid reference to related resource';
    code = 'INVALID_REFERENCE';
  }

  // Enhanced error logging
  const errorLog = {
    message: error.message,
    code,
    statusCode,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent'],
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      body: req.body,
      params: req.params,
      query: req.query
    })
  };

  // Log authentication errors specifically
  if (statusCode === 401) {
    console.warn('Authentication error:', errorLog);
  } else if (process.env.NODE_ENV === 'development') {
    console.error('Error:', errorLog);
  } else {
    // In production, log errors without sensitive data
    console.error('Error:', {
      message: error.message,
      code,
      statusCode,
      url: req.url,
      method: req.method,
      timestamp: errorLog.timestamp
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.method} ${req.path} not found`,
      code: 'ROUTE_NOT_FOUND'
    }
  });
};
