import { Router } from 'express';
import { storeCookieConsent, getCookieConsent } from '../controllers/cookieConsentController.js';
import { validateRequest } from '../middleware/validation.js';
import { storeCookieConsentSchema } from '../utils/cookieConsentValidation.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cookie Consent
 *   description: Cookie consent management
 */

/**
 * @swagger
 * /api/cookie-consent:
 *   post:
 *     summary: Store user's cookie consent preferences
 *     tags: [Cookie Consent]
 *     security:
 *       - bearerAuth: [] # Optional bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               preferences:
 *                 type: object
 *                 properties:
 *                   strictly_necessary:
 *                     type: boolean
 *                     default: true
 *                   functional:
 *                     type: boolean
 *                     default: false
 *                   analytics:
 *                     type: boolean
 *                     default: false
 *                   marketing:
 *                     type: boolean
 *                     default: false
 *                 required:
 *                   - strictly_necessary
 *                   - functional
 *                   - analytics
 *                   - marketing
 *               version:
 *                 type: string
 *                 example: "1.0"
 *               timestamp:
 *                 type: number
 *                 description: Client-side timestamp (epoch milliseconds)
 *                 example: 1678886400000
 *               sessionId:
 *                 type: string
 *                 description: Optional session ID for anonymous users
 *                 example: "session_abc123"
 *             required:
 *               - preferences
 *               - version
 *     responses:
 *       201:
 *         description: Consent preferences stored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cookie consent preferences stored successfully.
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  optionalAuth, // Use optional auth: if token provided, user is identified; otherwise, anonymous
  validateRequest(storeCookieConsentSchema),
  storeCookieConsent
);

/**
 * @swagger
 * /api/cookie-consent:
 *   get:
 *     summary: Retrieve user's latest cookie consent preferences (authenticated users only)
 *     tags: [Cookie Consent]
 *     security:
 *       - bearerAuth: [] # Requires bearer token
 *     responses:
 *       200:
 *         description: Successfully retrieved consent preferences or null if none found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 consent:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: string
 *                     preferences:
 *                       type: object
 *                       properties:
 *                         strictly_necessary:
 *                           type: boolean
 *                         functional:
 *                           type: boolean
 *                         analytics:
 *                           type: boolean
 *                         marketing:
 *                           type: boolean
 *                     version:
 *                       type: string
 *                     timestamp:
 *                       type: number
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                   example:
 *                     id: "uuid-of-consent"
 *                     preferences: { strictly_necessary: true, functional: true, analytics: false, marketing: false }
 *                     version: "1.0"
 *                     timestamp: 1678886400000
 *                     createdAt: "2023-03-15T12:00:00.000Z"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  '/',
  authenticate, // Requires authentication
  getCookieConsent
);

export default router;
