import { Router } from 'express';
import { storeCookieConsent, getCookieConsent, getCookieConsentAnalytics } from '../controllers/cookieConsentController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { cookieConsentSchema } from '../utils/cookieConsentValidation.js';

const router = Router();

// POST /api/cookie-consent
router.post('/', validateBody(cookieConsentSchema), authenticate, storeCookieConsent);

// GET /api/cookie-consent
router.get('/', authenticate, getCookieConsent);

// GET /api/admin/cookie-consents

export default router;
