// Interface for CookieConsent data model
// Matches the structure in schema.sql

export interface CookieConsentPreferencesDB {
  strictly_necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export interface CookieConsentRecord {
  id: string; // UUID
  user_id?: string | null; // Foreign key to users table
  session_id?: string | null;
  strictly_necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  consent_version: string;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: Date;
  updated_at: Date;
}

// For API responses, we might want a slightly different structure
export interface CookieConsentAPIResponse {
  id: string;
  preferences: CookieConsentPreferencesDB;
  version: string;
  timestamp: number; // Unix timestamp for frontend
  createdAt: string; // ISO string
}

// For storing in DB, we might get this from the request
export interface CookieConsentStorePayload {
  userId?: string;
  sessionId?: string;
  preferences: CookieConsentPreferencesDB;
  version: string;
  ipAddress?: string;
  userAgent?: string;
}
