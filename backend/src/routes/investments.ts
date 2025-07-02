import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { InvestmentController } from '../controllers/investmentController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validateBody, validateQuery } from '../middleware/validation.js';
import upload from '../middleware/upload.js';
import { createInvestmentSchema, updateInvestmentSchema, investmentFiltersSchema } from '../utils/validation.js';

const router = Router();

// Limit public investment submissions to prevent abuse
const submitInvestmentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 submissions per window
  message: {
    success: false,
    error: { message: 'Too many investment submissions, please try again later.' }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// GET /api/investments - Public endpoint with optional filters
router.get('/', 
  validateQuery(investmentFiltersSchema), 
  InvestmentController.getInvestments
);

// GET /api/investments/:id - Public endpoint
router.get('/:id', 
  InvestmentController.getInvestmentById
);

// POST /api/investments - Public endpoint to submit new investments
router.post('/',
  submitInvestmentLimiter,
  upload.array('images', 5),
  validateBody(createInvestmentSchema),
  InvestmentController.createInvestment
);

// PUT /api/investments/:id - Admin only
router.put('/:id',
  authenticate,
  requireAdmin,
  upload.array('images', 5),
  validateBody(updateInvestmentSchema),
  InvestmentController.updateInvestment
);

// DELETE /api/investments/:id - Admin only
router.delete('/:id',
  authenticate,
  requireAdmin,
  InvestmentController.deleteInvestment
);

export default router;
