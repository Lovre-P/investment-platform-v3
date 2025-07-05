import { pool, isMockMode } from '../database/config.js';
import { v4 as uuidv4 } from 'uuid';
import { RowDataPacket } from 'mysql2/promise';
import { CookieConsentPreferences, CookieConsentRecord } from '../types/index.js';

export interface CookieConsentInsert {
  userId?: string;
  sessionId?: string;
  preferences: CookieConsentPreferences;
  version: string;
  timestamp: number;
  ipAddress?: string;
  userAgent?: string;
}

export interface ConsentAnalyticsFilters {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  userId?: string;
}

interface CookieConsentRow extends RowDataPacket {
  id: string;
  userId: string | null;
  sessionId: string | null;
  strictlyNecessary: number;
  functional: number;
  analytics: number;
  marketing: number;
  version: string;
  ipAddress: string | null;
  userAgent: string | null;
  timestamp: number;
  created_at: string;
  updated_at: string;
}

type SqlValue = string | number | boolean | null | Date;

export async function createCookieConsent(data: CookieConsentInsert): Promise<string> {
    const id = uuidv4();

    if (isMockMode()) {
      return id;
    }

    try {
      await pool.execute(
        `INSERT INTO cookie_consents (
          id, user_id, session_id, strictly_necessary,
          functional, analytics, marketing, consent_version,
          ip_address, user_agent, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, FROM_UNIXTIME(?/1000))`,
        [
          id,
          data.userId || null,
          data.sessionId || null,
          true,
          data.preferences.functional,
          data.preferences.analytics,
          data.preferences.marketing,
          data.version,
          data.ipAddress || null,
          data.userAgent || null,
          data.timestamp
        ]
      );
    } catch (err) {
      console.error('Failed to insert cookie consent', err);
      throw err;
    }

    return id;
  }

export async function findLatestCookieConsentByUserId(userId: string): Promise<CookieConsentRecord | null> {
  if (isMockMode()) {
    return null;
  }

  try {
    const [rows] = await pool.execute<CookieConsentRow[]>(
      `SELECT id, user_id as userId, session_id as sessionId,
              strictly_necessary as strictlyNecessary,
              functional, analytics, marketing,
              consent_version as version, ip_address as ipAddress,
              user_agent as userAgent, UNIX_TIMESTAMP(created_at)*1000 as timestamp,
              created_at, updated_at
       FROM cookie_consents
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    );

    const row = rows[0];
    if (!row) return null;

    return {
      id: row.id,
      userId: row.userId,
      sessionId: row.sessionId,
      preferences: {
        strictlyNecessary: !!row.strictlyNecessary,
        functional: !!row.functional,
        analytics: !!row.analytics,
        marketing: !!row.marketing
      },
      version: row.version,
      timestamp: row.timestamp,
      ipAddress: row.ipAddress,
      userAgent: row.userAgent,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  } catch (err) {
    console.error('Error fetching latest cookie consent', err);
    throw err;
  }
}

async function getConsentCount(where: string, values: SqlValue[]): Promise<number> {
  interface CountRow extends RowDataPacket { count: number }
  const [rows] = await pool.execute<CountRow[]>(
    `SELECT COUNT(*) as count FROM cookie_consents ${where}`,
    values
  );
  return rows[0]?.count || 0;
}

async function getConsentRates(where: string, values: SqlValue[]) {
  interface RateRow extends RowDataPacket {
    total: number;
    functionalRate: string;
    analyticsRate: string;
    marketingRate: string;
    recentActivity: number;
  }
  const [rows] = await pool.execute<RateRow[]>(
    `SELECT COUNT(*) as total,
            AVG(functional) as functionalRate,
            AVG(analytics) as analyticsRate,
            AVG(marketing) as marketingRate,
            SUM(created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as recentActivity
     FROM cookie_consents ${where}`,
    values
  );
  return rows[0];
}

export async function getCookieConsentAnalytics(filters: ConsentAnalyticsFilters) {
  if (isMockMode()) {
    return {
      consents: [],
      pagination: { page: 1, limit: 0, total: 0, totalPages: 0 },
      analytics: { totalConsents: 0, acceptanceRates: { functional: 0, analytics: 0, marketing: 0 }, recentActivity: 0 }
    };
  }

  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const offset = (page - 1) * limit;

  let where = 'WHERE 1=1';
  const values: SqlValue[] = [];

  if (filters.userId) {
    where += ' AND user_id = ?';
    values.push(filters.userId);
  }
  if (filters.startDate) {
    where += ' AND created_at >= ?';
    values.push(filters.startDate);
  }
  if (filters.endDate) {
    where += ' AND created_at <= ?';
    values.push(filters.endDate);
  }

  try {
    const [rows] = await pool.execute<CookieConsentRow[]>(
      `SELECT id, user_id as userId, session_id as sessionId,
              strictly_necessary as strictlyNecessary,
              functional, analytics, marketing,
              consent_version as version, ip_address as ipAddress,
              user_agent as userAgent,
              UNIX_TIMESTAMP(created_at)*1000 as timestamp,
              created_at, updated_at
       FROM cookie_consents
       ${where}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    const total = await getConsentCount(where, values);
    const rate = await getConsentRates(where, values);

    const consents = rows.map(r => ({
      id: r.id,
      userId: r.userId,
      sessionId: r.sessionId,
      preferences: {
        strictlyNecessary: !!r.strictlyNecessary,
        functional: !!r.functional,
        analytics: !!r.analytics,
        marketing: !!r.marketing
      },
      version: r.version,
      timestamp: r.timestamp,
      ipAddress: r.ipAddress,
      userAgent: r.userAgent,
      createdAt: r.created_at,
      updatedAt: r.updated_at
    }));

    return {
      consents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      analytics: {
        totalConsents: rate.total || 0,
        acceptanceRates: {
          functional: parseFloat(rate.functionalRate) || 0,
          analytics: parseFloat(rate.analyticsRate) || 0,
          marketing: parseFloat(rate.marketingRate) || 0
        },
        recentActivity: rate.recentActivity || 0
      }
    };
  } catch (err) {
    console.error('Error fetching cookie consent analytics', err);
    throw err;
  }
}

