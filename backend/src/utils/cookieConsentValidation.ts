import { z } from 'zod';

export const cookieConsentSchema = z.object({
  preferences: z.object({
    strictly_necessary: z.boolean(),
    functional: z.boolean(),
    analytics: z.boolean(),
    marketing: z.boolean()
  }),
  version: z.string().min(1),
  timestamp: z.number().positive(),
  sessionId: z.string().optional()
});
