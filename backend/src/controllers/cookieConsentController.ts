import { Request, Response } from 'express';
import { pool } from '../database/config.js';
import { StoreCookieConsentInput, GetCookieConsentAnalyticsInput } from '../utils/cookieConsentValidation.js';
// No explicit AuthenticatedRequest needed due to global namespace augmentation in auth.ts
import { CookieConsentRecord, CookieConsentAPIResponse, CookieConsentPreferencesDB } from '../models/CookieConsent.js';
import { RowDataPacket, OkPacket } from 'mysql2';

// Helper to get client IP address
const getIpAddress = (req: Request): string | undefined => {
  const ff = req.headers['x-forwarded-for'];
  if (typeof ff === 'string') {
    return ff.split(',')[0].trim();
  }
  if (Array.isArray(ff)) {
    return ff[0].trim();
  }
  return req.socket?.remoteAddress;
};

export const storeCookieConsent = async (req: Request, res: Response) => {
  const { preferences, version, sessionId } = req.body as StoreCookieConsentInput;
  const userId = req.user?.id; // From JWT token if user is authenticated (type augmented globally)
  const ipAddress = getIpAddress(req);
  const userAgent = req.headers['user-agent'];

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    // Insert new consent
    const [result] = await connection.execute<OkPacket>(
      `INSERT INTO cookie_consents (user_id, session_id, strictly_necessary, functional, analytics, marketing, consent_version, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId || null,
        sessionId || null,
        preferences.strictly_necessary,
        preferences.functional,
        preferences.analytics,
        preferences.marketing,
        version,
        ipAddress || null,
        userAgent || null,
      ]
    );

    const consentId = result.insertId; // This might not be UUID, depends on AUTO_INCREMENT or if we generate UUID in app

    // If we used DEFAULT (UUID()) in SQL, we'd need to fetch the ID differently or generate it here.
    // For now, assuming insertId works or we adjust schema for auto-increment int ID for simplicity if UUID generation is an issue.
    // Let's assume the schema's DEFAULT (UUID()) works and we should generate UUID here if not.
    // For simplicity with OkPacket, let's assume id is auto-increment or we fetch it.
    // A better approach for UUIDs: generate it in the app and insert it.
    // const newId = crypto.randomUUID(); // if we generate it here.

    // For now, we don't have the ID easily from OkPacket if it's UUID.
    // This part needs refinement based on actual UUID strategy with MySQL.
    // Let's proceed as if we can get an ID or the client doesn't strictly need the *new* ID back for this call.

    await connection.commit();
    connection.release();

    res.status(201).json({
      success: true,
      // consentId: newId, // If generated in app
      message: 'Cookie consent preferences stored successfully.',
    });
  } catch (error) {
    console.error('Error storing cookie consent:', error);
    res.status(500).json({ success: false, message: 'Failed to store cookie consent preferences.' });
  }
};

export const getCookieConsent = async (req: Request, res: Response) => {
  const userId = req.user?.id; // Type augmented globally

  if (!userId) {
    return res.status(401).json({ success: false, message: 'User not authenticated.' });
  }

  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT id, strictly_necessary, functional, analytics, marketing, consent_version, created_at
       FROM cookie_consents
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(200).json({ success: true, consent: null });
    }

    const latestConsent = rows[0] as CookieConsentRecord;

    const response: CookieConsentAPIResponse = {
      id: latestConsent.id,
      preferences: {
        strictly_necessary: !!latestConsent.strictly_necessary,
        functional: !!latestConsent.functional,
        analytics: !!latestConsent.analytics,
        marketing: !!latestConsent.marketing,
      },
      version: latestConsent.consent_version,
      timestamp: new Date(latestConsent.created_at).getTime(),
      createdAt: new Date(latestConsent.created_at).toISOString(),
    };

    res.status(200).json({ success: true, consent: response });
  } catch (error) {
    console.error('Error retrieving cookie consent:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve cookie consent preferences.' });
  }
};

export const getCookieConsentAnalytics = async (req: Request, res: Response) => {
  // This is an admin endpoint, ensure admin role check middleware is applied in routes
  const { page, limit, startDate, endDate, userId } = req.query as unknown as GetCookieConsentAnalyticsInput;

  try {
    let query = `
      SELECT
        cc.id, cc.user_id, u.email as userEmail, cc.strictly_necessary, cc.functional, cc.analytics, cc.marketing,
        cc.consent_version, cc.ip_address, cc.user_agent, cc.created_at
      FROM cookie_consents cc
      LEFT JOIN users u ON cc.user_id = u.id
    `;
    const whereClauses: string[] = [];
    const params: (string | number)[] = [];

    if (startDate) {
      whereClauses.push("cc.created_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      whereClauses.push("cc.created_at <= ?");
      params.push(endDate);
    }
    if (userId) {
      whereClauses.push("cc.user_id = ?");
      params.push(userId);
    }

    if (whereClauses.length > 0) {
      query += " WHERE " + whereClauses.join(" AND ");
    }

    query += " ORDER BY cc.created_at DESC";

    // Count total records for pagination
    const countQuery = `SELECT COUNT(*) as total FROM (${query}) as subquery_for_count`; // params need to be passed here too without limit/offset
    const [totalResult] = await pool.execute<RowDataPacket[]>(countQuery, params);
    const total = totalResult[0].total;

    // Add pagination to main query
    query += " LIMIT ? OFFSET ?";
    params.push(limit, (page - 1) * limit);

    const [consentsRows] = await pool.execute<RowDataPacket[]>(query, params);

    const consents = consentsRows.map(row => ({
      id: row.id,
      userId: row.user_id,
      userEmail: row.userEmail,
      preferences: {
        strictly_necessary: !!row.strictly_necessary,
        functional: !!row.functional,
        analytics: !!row.analytics,
        marketing: !!row.marketing,
      },
      version: row.consent_version,
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
      createdAt: new Date(row.created_at).toISOString(),
    }));

    // Basic analytics calculation (can be expanded)
    const [analyticsData] = await pool.execute<RowDataPacket[]>(`
      SELECT
        COUNT(*) as totalConsents,
        SUM(CASE WHEN functional = TRUE THEN 1 ELSE 0 END) as functionalAccepted,
        SUM(CASE WHEN analytics = TRUE THEN 1 ELSE 0 END) as analyticsAccepted,
        SUM(CASE WHEN marketing = TRUE THEN 1 ELSE 0 END) as marketingAccepted,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as recentActivity
      FROM cookie_consents
    `);

    const stats = analyticsData[0];
    const acceptanceRates = {
      functional: stats.totalConsents > 0 ? (stats.functionalAccepted / stats.totalConsents) * 100 : 0,
      analytics: stats.totalConsents > 0 ? (stats.analyticsAccepted / stats.totalConsents) * 100 : 0,
      marketing: stats.totalConsents > 0 ? (stats.marketingAccepted / stats.totalConsents) * 100 : 0,
    };

    res.status(200).json({
      success: true,
      data: {
        consents,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        analytics: {
          totalConsents: stats.totalConsents,
          acceptanceRates,
          recentActivity: stats.recentActivity,
        },
      },
    });

  } catch (error) {
    console.error('Error fetching cookie consent analytics:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch cookie consent analytics.' });
  }
};
