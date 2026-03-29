import { Router } from 'express';
import { AvailabilityController } from '../controllers/availability.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { availabilitySchema, overrideSchema } from '../validators/index.js';

const router = Router();

router.post('/', authenticate, validate(availabilitySchema), AvailabilityController.setAvailability);
router.get('/', authenticate, AvailabilityController.getAvailability);
router.delete('/:id', authenticate, AvailabilityController.deleteAvailability);
router.post('/override', authenticate, validate(overrideSchema), AvailabilityController.setOverride);
router.get('/override', authenticate, AvailabilityController.getOverrides);
router.delete('/override/:id', authenticate, AvailabilityController.deleteOverride);

export default router;
