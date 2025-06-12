import { Router } from 'express';
import { InvestmentController } from '../controllers/investmentController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validateBody, validateQuery } from '../middleware/validation.js';
import { createInvestmentSchema, updateInvestmentSchema, investmentFiltersSchema } from '../utils/validation.js';

const router = Router();

// GET /api/investments - Public endpoint with optional filters
router.get('/', 
  validateQuery(investmentFiltersSchema), 
  InvestmentController.getInvestments
);

// GET /api/investments/:id - Public endpoint
router.get('/:id', 
  InvestmentController.getInvestmentById
);

// POST /api/investments - Admin only
router.post('/', 
  authenticate,
  requireAdmin,
  validateBody(createInvestmentSchema),
  InvestmentController.createInvestment
);

// PUT /api/investments/:id - Admin only
router.put('/:id',
  authenticate,
  requireAdmin,
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
