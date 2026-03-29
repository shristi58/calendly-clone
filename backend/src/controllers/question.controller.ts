import { Response, NextFunction } from 'express';
import { QuestionService } from '../services/question.service.js';
import { EventTypeService } from '../services/event-type.service.js';
import { AuthRequest } from '../middlewares/auth.js';
import { AppError } from '../utils/errors.js';

export class QuestionController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const eventType = await EventTypeService.findById(req.body.eventTypeId);
      if (!eventType || eventType.userId !== req.userId) {
        throw new AppError(403, 'Not authorized to add questions to this event type');
      }

      const question = await QuestionService.create(req.body);
      res.status(201).json({ status: 'success', data: question });
    } catch (error) { next(error); }
  }

  static async findByEventTypeId(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const eventTypeId = req.query.eventTypeId as string;
      if (!eventTypeId) throw new AppError(400, 'eventTypeId is required');

      const questions = await QuestionService.findByEventTypeId(eventTypeId);
      res.status(200).json({ status: 'success', data: questions });
    } catch (error) { next(error); }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const existing = await QuestionService.findById(req.params.id as string);
      if (!existing || existing.eventType.userId !== req.userId) {
        throw new AppError(404, 'Question not found or unauthorized');
      }
      const question = await QuestionService.update(req.params.id as string, req.body);
      res.status(200).json({ status: 'success', data: question });
    } catch (error) { next(error); }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const existing = await QuestionService.findById(req.params.id as string);
      if (!existing || existing.eventType.userId !== req.userId) {
        throw new AppError(404, 'Question not found or unauthorized');
      }
      await QuestionService.delete(req.params.id as string);
      res.status(204).send();
    } catch (error) { next(error); }
  }
}
