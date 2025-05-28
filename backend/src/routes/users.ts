import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validation.js';
import { createUserSchema, updateUserSchema } from '../utils/validation.js';

const router = Router();

// All user management routes require admin authentication
router.use(authenticate, requireAdmin);

// GET /api/users
router.get('/', UserController.getUsers);

// GET /api/users/:id
router.get('/:id', UserController.getUserById);

// POST /api/users
router.post('/',
  validateBody(createUserSchema),
  UserController.createUser
);

// PUT /api/users/:id
router.put('/:id',
  validateBody(updateUserSchema),
  UserController.updateUser
);

// DELETE /api/users/:id
router.delete('/:id', UserController.deleteUser);

export default router;
