import { Router } from 'express';
import { PlatformSettingsController } from '../controllers/platformSettingsController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { 
  createPlatformSettingSchema, 
  updatePlatformSettingSchema,
  updateSettingValueSchema,
  bulkUpdateSettingsSchema
} from '../utils/validation.js';

const router = Router();

// GET /api/settings - Admin only (can get public settings with query param)
router.get('/',
  authenticate,
  requireAdmin,
  PlatformSettingsController.getSettings
);

// GET /api/settings/:key - Admin only
router.get('/:key',
  authenticate,
  requireAdmin,
  PlatformSettingsController.getSettingByKey
);

// GET /api/settings/:key/value - Admin only
router.get('/:key/value',
  authenticate,
  requireAdmin,
  PlatformSettingsController.getSettingValue
);

// POST /api/settings - Admin only
router.post('/',
  authenticate,
  requireAdmin,
  validateBody(createPlatformSettingSchema),
  PlatformSettingsController.createSetting
);

// PUT /api/settings/:key - Admin only
router.put('/:key',
  authenticate,
  requireAdmin,
  validateBody(updatePlatformSettingSchema),
  PlatformSettingsController.updateSetting
);

// PUT /api/settings/:key/value - Admin only
router.put('/:key/value',
  authenticate,
  requireAdmin,
  validateBody(updateSettingValueSchema),
  PlatformSettingsController.updateSettingValue
);

// POST /api/settings/bulk-update - Admin only
router.post('/bulk-update',
  authenticate,
  requireAdmin,
  validateBody(bulkUpdateSettingsSchema),
  PlatformSettingsController.bulkUpdateSettings
);

// DELETE /api/settings/:key - Admin only
router.delete('/:key',
  authenticate,
  requireAdmin,
  PlatformSettingsController.deleteSetting
);

export default router;
