import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import investmentRoutes from './routes/investments.js';
import leadRoutes from './routes/leads.js';
import userRoutes from './routes/users.js';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
// import { secureStaticFiles } from './middleware/secureStatic.js'; // Commented out - using Cloudinary instead

// Import database
import { testConnection, closePool } from './database/config.js';

// Load environment variables
dotenv.config();

if (
  !process.env.SMTP_HOST ||
  !process.env.SMTP_PORT ||
  !process.env.SMTP_USER ||
  !process.env.SMTP_PASS
) {
  console.warn('Email service not configured - emails will fail');
}

const app = express();
const PORT = process.env.PORT || 3001;
// const uploadDir = process.env.UPLOAD_DIR || 'uploads'; // No longer needed - using Cloudinary

// Trust proxy for Railway/production deployment
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // Trust first proxy (Railway, Render, etc.)
}

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting - More reasonable limits for admin usage
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000'), // Increased to 1000 requests per 15 minutes (~66/min)
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for authenticated admin users in development
  skip: (req) => {
    if (process.env.NODE_ENV === 'development') {
      return true; // Skip rate limiting in development
    }
    return false;
  }
});

// Stricter rate limiting for auth endpoints (login attempts)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit login attempts to 20 per 15 minutes
  message: {
    success: false,
    error: {
      message: 'Too many login attempts from this IP, please try again later.',
      code: 'AUTH_RATE_LIMIT_EXCEEDED'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general rate limiting to all routes
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Secure static file serving middleware - DISABLED: Using Cloudinary CDN instead
// app.use(`/${uploadDir}`, secureStaticFiles(uploadDir));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes with specific rate limiting
app.use('/api/auth', authLimiter, authRoutes); // Apply stricter rate limiting to auth routes
app.use('/api/investments', investmentRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ Failed to connect to database. Exiting...');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`📝 API Documentation available at: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  await closePool();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  await closePool();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();
