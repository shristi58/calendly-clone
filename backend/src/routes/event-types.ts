import { Router } from 'express';
import { EventTypeController } from '../controllers/event-type.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createEventTypeSchema, updateEventTypeSchema } from '../validators/index.js';

const router = Router();

// Public: lookup by slug (for booking page)
router.get('/slug/:slug', EventTypeController.findBySlug);
router.get('/user/:userId', EventTypeController.findByUser);

// Protected: CRUD
router.post('/', authenticate, validate(createEventTypeSchema), EventTypeController.create);
router.get('/', authenticate, EventTypeController.findAll);
router.get('/:id', authenticate, EventTypeController.findById);
router.put('/:id', authenticate, validate(updateEventTypeSchema), EventTypeController.update);
router.delete('/:id', authenticate, EventTypeController.delete);

export default router;
