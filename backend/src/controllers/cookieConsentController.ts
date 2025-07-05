import { Request, Response, NextFunction } from 'express';
import {
  createCookieConsent,
  findLatestCookieConsentByUserId,
  getCookieConsentAnalytics as fetchCookieConsentAnalytics,
  ConsentAnalyticsFilters,
  CookieConsentInsert
} from '../models/CookieConsent.js';
import { cookieConsentSchema } from '../utils/cookieConsentValidation.js';
import { JWTPayload } from '../types/index.js';

interface AuthRequest extends Request {
  user?: JWTPayload;
}

export const storeCookieConsent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = cookieConsentSchema.parse(req.body);
    const userId = req.user?.userId;
    const ip = req.ip;
    const userAgent = req.get('user-agent') || undefined;

    const insert: CookieConsentInsert = {
      userId,
      sessionId: data.sessionId,
      preferences: {
        strictlyNecessary: data.preferences.strictlyNecessary,
        functional: data.preferences.functional,
        analytics: data.preferences.analytics,
        marketing: data.preferences.marketing
      },
      version: data.version,
      timestamp: data.timestamp,
      ipAddress: ip,
      userAgent
    };

    const consentId = await createCookieConsent(insert);

    res.status(201).json({ success: true, consentId, message: 'Consent stored' });
  } catch (error) {
    next(error);
  }
};

export const getCookieConsent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(200).json({ success: true, consent: null });
      return;
    }
    const consent = await findLatestCookieConsentByUserId(userId);
    res.status(200).json({ success: true, consent });
  } catch (error) {
    next(error);
  }
};

export const getCookieConsentAnalytics = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let page = req.query.page ? parseInt(String(req.query.page)) : 1;
    let limit = req.query.limit ? parseInt(String(req.query.limit)) : 20;

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1 || limit > 100) limit = 20;

    const filters: ConsentAnalyticsFilters = {
      page,
      limit,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      userId: req.query.userId as string | undefined
    };

    const data = await fetchCookieConsentAnalytics(filters);
    res.status(200).json({ success: true, data: { consents: data } });
  } catch (error) {
    next(error);
  }
};
