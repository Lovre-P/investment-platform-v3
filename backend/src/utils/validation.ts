import { z } from 'zod';
import { InvestmentStatus, UserRole } from '../types/index.js';

// Accept booleans as true/false, '1'/'0', 'yes'/'no', 'on'/'off', or 1/0
export const booleanish = z.preprocess((val) => {
  if (typeof val === 'string') {
    const v = val.toLowerCase().trim();
    if (v === 'true' || v === '1' || v === 'yes' || v === 'on') return true;
    if (v === 'false' || v === '0' || v === 'no' || v === 'off') return false;
  }
  if (typeof val === 'number') return val === 1;
  return val;
}, z.boolean());


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
  amountGoal: z.coerce.number().positive(),
  currency: z.string().min(3).max(10),
  images: z.union([
    z.array(z.string().url()),
    z.string().transform(val => val ? [val] : [])
  ]).optional(),
  category: z.string().min(1).max(100),
  submittedBy: z.string().min(1).max(255),
  submitterEmail: z.string().email(),
  apyRange: z.string().optional(),
  minInvestment: z.coerce.number().positive().optional(),
  term: z.string().optional(),
  tags: z.union([
    z.array(z.string()),
    z.string().transform(val => val ? val.split(',').map(t => t.trim()).filter(t => t) : [])
  ]).optional()
});

export const updateInvestmentSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  longDescription: z.string().min(1).optional(),
  amountGoal: z.coerce.number().positive().optional(),
  amountRaised: z.coerce.number().min(0).optional(),
  currency: z.string().min(3).max(10).optional(),
  images: z.union([
    z.array(z.string().url()),
    z.string().transform(val => val ? [val] : [])
  ]).optional(),
  category: z.string().min(1).max(100).optional(),
  status: z.nativeEnum(InvestmentStatus).optional(),
  submittedBy: z.string().min(1).max(255).optional(),
  submitterEmail: z.string().email().optional(),
  apyRange: z.string().optional(),
  minInvestment: z.coerce.number().positive().optional(),
  term: z.string().optional(),
  tags: z.union([
    z.array(z.string()),
    z.string().transform(val => val ? val.split(',').map(t => t.trim()).filter(t => t) : [])
  ]).optional()
});

// Lead validation schemas
export const createLeadSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
  investmentId: z.string().uuid().optional()
});

// Investment-specific lead validation schema (stricter requirements)
export const createInvestmentLeadSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  phone: z.string().min(1, 'Phone number is required for investment inquiries'),
  message: z.string().min(1),
  investmentId: z.string().uuid()
});

export const updateLeadStatusSchema = z.object({
  status: z.enum(['New', 'Contacted', 'Converted', 'Rejected'])
});


// Bulk delete leads schema
export const bulkDeleteLeadsSchema = z.object({
  ids: z.array(z.string().uuid())
    .min(1, 'At least one lead id is required')
    .max(100, 'Too many lead ids; please delete in smaller batches')
    .refine((arr) => new Set(arr).size === arr.length, 'Duplicate ids are not allowed')
});

// Query parameter validation
export const investmentFiltersSchema = z.object({
  status: z.nativeEnum(InvestmentStatus).optional(),
  category: z.string().optional(),
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).max(100).default(10).optional()
});

// Investment Category validation schemas
export const createInvestmentCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  isActive: booleanish.default(true).optional(),
  sortOrder: z.number().int().min(0).default(0).optional()
});

export const updateInvestmentCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  isActive: booleanish.optional(),
  sortOrder: z.number().int().min(0).optional()
});

// Platform Settings validation schemas
export const createPlatformSettingSchema = z.object({
  settingKey: z.string().min(1).max(100),
  settingValue: z.string(),
  settingType: z.enum(['string', 'number', 'boolean', 'json']).default('string').optional(),
  description: z.string().optional(),
  isPublic: booleanish.default(false).optional()
});

export const updatePlatformSettingSchema = z.object({
  settingValue: z.string().optional(),
  settingType: z.enum(['string', 'number', 'boolean', 'json']).optional(),
  description: z.string().optional(),
  isPublic: booleanish.optional()
});

export const updateSettingValueSchema = z.object({
  value: z.union([z.string(), z.number(), z.boolean()])
});

export const bulkUpdateSettingsSchema = z.object({
  settings: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
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
