import { Router } from 'express';
import { LeadController } from '../controllers/leadController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { createLeadSchema, updateLeadStatusSchema } from '../utils/validation.js';

const router = Router();

// GET /api/leads - Admin only
router.get('/', 
  authenticate,
  requireAdmin,
  LeadController.getLeads
);

// GET /api/leads/:id - Admin only
router.get('/:id',
  authenticate,
  requireAdmin,
  LeadController.getLeadById
);

// POST /api/leads - Public endpoint (for contact forms)
router.post('/',
  validateBody(createLeadSchema),
  LeadController.createLead
);

// PUT /api/leads/:id/status - Admin only
router.put('/:id/status',
  authenticate,
  requireAdmin,
  validateBody(updateLeadStatusSchema),
  LeadController.updateLeadStatus
);

// DELETE /api/leads/:id - Admin only (optional, for cleanup)
router.delete('/:id',
  authenticate,
  requireAdmin,
  LeadController.deleteLead
);

export default router;
