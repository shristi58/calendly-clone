import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { registerSchema, loginSchema, updateProfileSchema, onboardingSchema } from '../validators/index.js';

const router = Router();

router.post('/check-email', AuthController.checkEmail);
router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);
router.get('/me', authenticate, AuthController.me);
router.patch('/me', authenticate, validate(updateProfileSchema), AuthController.updateProfile);
router.post('/onboarding', authenticate, validate(onboardingSchema), AuthController.onboarding);
router.delete('/oauth/:provider', authenticate, AuthController.unlinkOAuth);

export default router;
