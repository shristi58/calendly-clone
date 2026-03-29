import { Router } from 'express';
import { ScheduleController } from '../controllers/schedule.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createScheduleSchema, updateScheduleSchema } from '../validators/index.js';

const router = Router();

router.post('/', authenticate, validate(createScheduleSchema), ScheduleController.create);
router.get('/', authenticate, ScheduleController.findAll);
router.get('/:id', authenticate, ScheduleController.findById);
router.put('/:id', authenticate, validate(updateScheduleSchema), ScheduleController.update);
router.delete('/:id', authenticate, ScheduleController.delete);

export default router;
