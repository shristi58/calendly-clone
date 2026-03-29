import { Router } from 'express';
import { QuestionController } from '../controllers/question.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createQuestionSchema, updateQuestionSchema } from '../validators/index.js';

const router = Router();

router.post('/', authenticate, validate(createQuestionSchema), QuestionController.create);
// Making it public so booking page can fetch questions
router.get('/', QuestionController.findByEventTypeId);
router.put('/:id', authenticate, validate(updateQuestionSchema), QuestionController.update);
router.delete('/:id', authenticate, QuestionController.delete);

export default router;
