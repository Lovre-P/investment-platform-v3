import { describe, it, expect } from 'vitest';
import { cookieConsentService } from '../services/cookieConsentService';

describe('cookieConsentService generateUUID', () => {
  it('returns a valid UUID string', () => {
    const id = (cookieConsentService as any).generateUUID();
    expect(id).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
  });
});
