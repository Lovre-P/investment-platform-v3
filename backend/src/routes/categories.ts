import { Router } from 'express';
import { InvestmentCategoryController } from '../controllers/investmentCategoryController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { createInvestmentCategorySchema, updateInvestmentCategorySchema } from '../utils/validation.js';

const router = Router();

// GET /api/categories - Public endpoint to get active categories
router.get('/', InvestmentCategoryController.getCategories);

// GET /api/categories/:id - Public endpoint to get category by ID
router.get('/:id', InvestmentCategoryController.getCategoryById);

// GET /api/categories/:name/usage - Admin only, check category usage
router.get('/:name/usage',
  authenticate,
  requireAdmin,
  InvestmentCategoryController.getCategoryUsage
);

// POST /api/categories - Admin only
router.post('/',
  authenticate,
  requireAdmin,
  validateBody(createInvestmentCategorySchema),
  InvestmentCategoryController.createCategory
);

// PUT /api/categories/:id - Admin only
router.put('/:id',
  authenticate,
  requireAdmin,
  validateBody(updateInvestmentCategorySchema),
  InvestmentCategoryController.updateCategory
);

// DELETE /api/categories/:id - Admin only
router.delete('/:id',
  authenticate,
  requireAdmin,
  InvestmentCategoryController.deleteCategory
);

export default router;
