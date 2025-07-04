import { z } from 'zod';

export const cookiePreferencesSchema = z.object({
  strictly_necessary: z.boolean().default(true),
  functional: z.boolean().default(false),
  analytics: z.boolean().default(false),
  marketing: z.boolean().default(false),
});

export const storeCookieConsentSchema = z.object({
  body: z.object({
    preferences: cookiePreferencesSchema,
    version: z.string().min(1).max(10).default('1.0'),
    timestamp: z.number().positive().optional(), // Timestamp from client, we'll use server's mostly
    sessionId: z.string().max(255).optional(),
  }),
});

export type StoreCookieConsentInput = z.infer<typeof storeCookieConsentSchema>['body'];

export const getCookieConsentAnalyticsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().optional().default(10),
    startDate: z.string().datetime({ offset: true }).optional(),
    endDate: z.string().datetime({ offset: true }).optional(),
    userId: z.string().uuid().optional(),
  }),
});

export type GetCookieConsentAnalyticsInput = z.infer<typeof getCookieConsentAnalyticsSchema>['query'];
