import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { loginSchema } from '../utils/validation.js';

const router = Router();

// POST /api/auth/login
router.post('/login', validateBody(loginSchema), AuthController.login);

// GET /api/auth/session
router.get('/session', authenticate, AuthController.checkSession);

// POST /api/auth/logout
router.post('/logout', authenticate, AuthController.logout);

export default router;
