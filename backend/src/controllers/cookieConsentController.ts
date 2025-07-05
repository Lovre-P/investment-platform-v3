import { Request, Response } from 'express';
import { pool } from '../database/config.js';
import { StoreCookieConsentInput, GetCookieConsentAnalyticsInput } from '../utils/cookieConsentValidation.js';
// No explicit AuthenticatedRequest needed due to global namespace augmentation in auth.ts
import { CookieConsentRecord, CookieConsentAPIResponse, CookieConsentPreferencesDB } from '../models/CookieConsent.js';
import { RowDataPacket, OkPacket, PoolConnection } from 'mysql2/promise'; // Import PoolConnection
import crypto from 'crypto'; // Import crypto for UUID generation

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

  let connection: PoolConnection | undefined;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const newConsentId = crypto.randomUUID();

    // Insert new consent with app-generated UUID
    await connection.execute<OkPacket>(
      `INSERT INTO cookie_consents (id, user_id, session_id, strictly_necessary, functional, analytics, marketing, consent_version, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newConsentId,
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

    await connection.commit();
    connection.release();

    res.status(201).json({
      success: true,
      consentId: newConsentId,
      message: 'Cookie consent preferences stored successfully.',
    });
  } catch (error) {
    console.error('Error storing cookie consent:', error);
    if (connection) { // Check if connection was established
      try {
        await connection.rollback(); // Rollback transaction on error
      } catch (rollbackError) {
        console.error('Error during rollback:', rollbackError);
      } finally {
        connection.release(); // Release connection in finally block of catch
      }
    }
    // Avoid sending response if headers already sent (though less likely here with early exit on error)
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Failed to store cookie consent preferences.' });
    }
  }
  // Removed the outer finally block as connection release is handled within try (after commit)
  // and catch (after rollback attempt).
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

    // Count total records for pagination using CTE
    const countQuery = `
      WITH FilteredConsents AS (
        ${query}
        -- Parameters for filtering are already part of the 'query' string here
        -- and will be passed to pool.execute for the count
      )
      SELECT COUNT(*) as total FROM FilteredConsents;
    `;
    // Note: The 'params' array for countQuery should be the same as for the main query *before* adding LIMIT/OFFSET
    const [totalResult] = await pool.execute<RowDataPacket[]>(countQuery, [...params]); // Use a copy of params before modification
    const total = totalResult[0].total;

    // Add pagination to main query
    const paginatedQuery = `${query} LIMIT ? OFFSET ?`;
    const queryParamsWithPagination = [...params, limit, (page - 1) * limit];

    const [consentsRows] = await pool.execute<RowDataPacket[]>(paginatedQuery, queryParamsWithPagination);

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

export const deleteCookieConsent = async (req: Request, res: Response) => {
  const userId = req.user?.id; // From JWT token if user is authenticated
  // const { sessionId } = req.body; // Could be used for anonymous users if needed

  if (!userId) {
    // For now, we only support deleting consents for authenticated users.
    // If anonymous user consent deletion is needed, it would typically be by session_id
    // or the frontend would just clear local storage without a server call.
    // Alternatively, a specific consent ID could be passed if known.
    return res.status(401).json({ success: false, message: 'User not authenticated. No consent to delete on server.' });
  }

  try {
    const connection = await pool.getConnection();
    // Delete all consents for the given user_id
    // We could also opt to "soft delete" or mark as withdrawn if auditability of withdrawal is key
    const [result] = await connection.execute<OkPacket>(
      `DELETE FROM cookie_consents WHERE user_id = ?`,
      [userId]
    );
    connection.release();

    if (result.affectedRows > 0) {
      res.status(200).json({ success: true, message: 'Cookie consent records deleted successfully.' });
    } else {
      res.status(200).json({ success: true, message: 'No cookie consent records found for this user to delete.' });
    }
  } catch (error) {
    console.error('Error deleting cookie consent:', error);
    res.status(500).json({ success: false, message: 'Failed to delete cookie consent records.' });
  }
};
