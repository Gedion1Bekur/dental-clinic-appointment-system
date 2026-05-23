import { Router } from 'express';
import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { registerSchema, loginSchema, profileUpdateSchema } from '../validators/schemas.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', authenticate, userController.getProfile);
router.put('/profile', authenticate, validate(profileUpdateSchema), userController.updateProfile);

export default router;
