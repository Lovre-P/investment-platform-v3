import { z } from 'zod';
import { InvestmentStatus, UserRole } from '../types/index.js';

// User validation schemas
export const loginSchema = z.object({
  email: z.string().email().optional(),
  username: z.string().min(3).optional(),
  password: z.string().min(6)
}).refine(data => data.email || data.username, {
  message: "Either email or username must be provided"
});

export const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(UserRole)
});

export const updateUserSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
  role: z.nativeEnum(UserRole).optional()
});

// Investment validation schemas
export const createInvestmentSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  longDescription: z.string().min(1),
  amountGoal: z.number().positive(),
  currency: z.string().min(3).max(10),
  images: z.array(z.string().url()),
  category: z.string().min(1).max(100),
  submittedBy: z.string().min(1).max(255),
  submitterEmail: z.string().email(),
  apyRange: z.string().optional(),
  minInvestment: z.number().positive().optional(),
  term: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export const updateInvestmentSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  longDescription: z.string().min(1).optional(),
  amountGoal: z.number().positive().optional(),
  amountRaised: z.number().min(0).optional(),
  currency: z.string().min(3).max(10).optional(),
  images: z.array(z.string().url()).optional(),
  category: z.string().min(1).max(100).optional(),
  status: z.nativeEnum(InvestmentStatus).optional(),
  submittedBy: z.string().min(1).max(255).optional(),
  submitterEmail: z.string().email().optional(),
  apyRange: z.string().optional(),
  minInvestment: z.number().positive().optional(),
  term: z.string().optional(),
  tags: z.array(z.string()).optional()
});

// Lead validation schemas
export const createLeadSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
  investmentId: z.string().uuid().optional()
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(['New', 'Contacted', 'Converted', 'Rejected'])
});

// Query parameter validation
export const investmentFiltersSchema = z.object({
  status: z.nativeEnum(InvestmentStatus).optional(),
  category: z.string().optional(),
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).max(100).default(10).optional()
});

// Utility function to validate request body
export const validateRequestBody = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Validation failed: ${errorMessages.join(', ')}`);
    }
    throw error;
  }
};
