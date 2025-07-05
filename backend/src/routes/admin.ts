import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { getCookieConsentAnalytics } from '../controllers/cookieConsentController.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/cookie-consents', getCookieConsentAnalytics);

export default router;
