import { Router } from 'express';
import { getCookieConsentAnalytics } from '../controllers/cookieConsentController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { getCookieConsentAnalyticsSchema } from '../utils/cookieConsentValidation.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin - Cookie Consents
 *   description: Admin operations for cookie consent analytics
 */

/**
 * @swagger
 * /api/admin/cookie-consents:
 *   get:
 *     summary: Get cookie consent analytics and compliance data
 *     tags: [Admin - Cookie Consents]
 *     security:
 *       - bearerAuth: [] # Requires admin bearer token
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter consents from this date (ISO 8601)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter consents up to this date (ISO 8601)
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter consents by user ID
 *     responses:
 *       200:
 *         description: Successfully retrieved consent analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     consents:
 *                       type: array
 *                       items:
 *                         type: object # Define structure based on controller response
 *                     pagination:
 *                       type: object # Define structure based on controller response
 *                     analytics:
 *                       type: object # Define structure based on controller response
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Unauthorized (not authenticated)
 *       403:
 *         description: Forbidden (not an admin)
 *       500:
 *         description: Server error
 */
router.get(
  '/cookie-consents',
  authenticate,
  requireAdmin,
  validateRequest(getCookieConsentAnalyticsSchema),
  getCookieConsentAnalytics
);

export default router;
