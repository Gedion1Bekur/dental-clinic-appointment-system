import { Router } from 'express';
import userController from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validate.js';
import { updateUserSchema, idParamSchema } from '../validators/schemas.js';

const router = Router();

router.use(authenticate, requireRole('admin'));

router.get('/', userController.list);
router.put('/:id', validate(updateUserSchema), userController.update);
router.delete('/:id', validate(idParamSchema), userController.remove);

export default router;
