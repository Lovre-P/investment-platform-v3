import { Request, Response, NextFunction } from 'express';
import CookieConsentModel, { ConsentAnalyticsFilters, CookieConsentInsert } from '../models/CookieConsent.js';
import { cookieConsentSchema } from '../utils/cookieConsentValidation.js';

export const storeCookieConsent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = cookieConsentSchema.parse(req.body);
    const userId = (req as any).user?.userId;
    const ip = req.ip;
    const userAgent = req.get('user-agent') || undefined;

    const insert: CookieConsentInsert = {
      userId,
      sessionId: data.sessionId,
      preferences: {
        strictlyNecessary: data.preferences.strictly_necessary,
        functional: data.preferences.functional,
        analytics: data.preferences.analytics,
        marketing: data.preferences.marketing
      },
      version: data.version,
      timestamp: data.timestamp,
      ipAddress: ip,
      userAgent
    };

    const consentId = await CookieConsentModel.create(insert);

    res.status(201).json({ success: true, consentId, message: 'Consent stored' });
  } catch (error) {
    next(error);
  }
};

export const getCookieConsent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(200).json({ success: true, consent: null });
      return;
    }
    const consent = await CookieConsentModel.findLatestByUserId(userId);
    res.status(200).json({ success: true, consent });
  } catch (error) {
    next(error);
  }
};

export const getCookieConsentAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filters: ConsentAnalyticsFilters = {
      page: req.query.page ? parseInt(String(req.query.page)) : 1,
      limit: req.query.limit ? parseInt(String(req.query.limit)) : 20,
      startDate: req.query.startDate as string | undefined,
      endDate: req.query.endDate as string | undefined,
      userId: req.query.userId as string | undefined
    };

    const data = await CookieConsentModel.getAnalytics(filters);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
