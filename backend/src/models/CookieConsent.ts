import { pool, isMockMode } from '../database/config.js';
import { v4 as uuidv4 } from 'uuid';
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

interface CookieConsentRow {
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

export class CookieConsentModel {
  static async create(data: CookieConsentInsert): Promise<string> {
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

  static async findLatestByUserId(userId: string): Promise<CookieConsentRecord | null> {
    if (isMockMode()) {
      return null;
    }

    let rows: any[];
    try {
      const [dbRows] = await pool.execute(
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
      ) as any;
      rows = dbRows as any[];
    } catch (err) {
      console.error('Error fetching latest cookie consent', err);
      throw err;
    }

    const row = (rows as CookieConsentRow[])[0];
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
  }

  static async getAnalytics(filters: ConsentAnalyticsFilters) {
    if (isMockMode()) {
      return { consents: [], pagination: { page: 1, limit: 0, total: 0, totalPages: 0 }, analytics: { totalConsents: 0, acceptanceRates: { functional: 0, analytics: 0, marketing: 0 }, recentActivity: 0 } };
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    let where = 'WHERE 1=1';
    const values: any[] = [];

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

    let rows: any[] = [];
    let countRows: any[] = [];
    let rateRows: any[] = [];
    try {
      const [r] = await pool.execute(
        `SELECT id, user_id as userId, session_id as sessionId,
                strictly_necessary as strictlyNecessary,
                functional, analytics, marketing,
                consent_version as version, ip_address as ipAddress,
                user_agent as userAgent, created_at, updated_at
         FROM cookie_consents
         ${where}
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
        [...values, limit, offset]
      ) as any;
      rows = r as any[];

      const [count] = await pool.execute(`SELECT COUNT(*) as count FROM cookie_consents ${where}`, values) as any;
      countRows = count as any[];

      const [rate] = await pool.execute(
        `SELECT COUNT(*) as total,
                AVG(functional) as functionalRate,
                AVG(analytics) as analyticsRate,
                AVG(marketing) as marketingRate,
                SUM(created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as recentActivity
         FROM cookie_consents ${where}`,
        values
      ) as any;
      rateRows = rate as any[];
    } catch (err) {
      console.error('Error fetching cookie consent analytics', err);
      throw err;
    }

    const total = (countRows as any[])[0].count as number;

    const rate = (rateRows as any[])[0];

    const consents = (rows as CookieConsentRow[]).map(r => ({
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
  }
}

export default CookieConsentModel;
