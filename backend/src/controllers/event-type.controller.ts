import { Response, NextFunction } from 'express';
import { EventTypeService } from '../services/event-type.service.js';
import { AuthRequest } from '../middlewares/auth.js';
import { AppError } from '../utils/errors.js';

export class EventTypeController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const eventType = await EventTypeService.create({ ...req.body, userId: req.userId! });
      res.status(201).json({ status: 'success', data: eventType });
    } catch (error) { next(error); }
  }

  static async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const eventTypes = await EventTypeService.findAll(req.userId!);
      res.status(200).json({ status: 'success', data: eventTypes });
    } catch (error) { next(error); }
  }

  static async findById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const eventType = await EventTypeService.findById(req.params.id as string);
      if (!eventType) {
        res.status(404).json({ status: 'fail', message: 'Not found' });
        return;
      }
      res.status(200).json({ status: 'success', data: eventType });
    } catch (error) { next(error); }
  }

  static async findBySlug(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const eventType = await EventTypeService.findBySlug(req.params.slug as string);
      if (!eventType) {
        res.status(404).json({ status: 'fail', message: 'Not found' });
        return;
      }
      res.status(200).json({ status: 'success', data: eventType });
    } catch (error) { next(error); }
  }

  static async findByUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const eventTypes = await EventTypeService.findAll(req.params.userId as string);
      res.status(200).json({ status: 'success', data: eventTypes });
    } catch (error) { next(error); }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const existing = await EventTypeService.findById(req.params.id as string);
      if (!existing || existing.userId !== req.userId) {
        throw new AppError(404, 'Event type not found');
      }
      const eventType = await EventTypeService.update(req.params.id as string, req.body);
      res.status(200).json({ status: 'success', data: eventType });
    } catch (error) { next(error); }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const existing = await EventTypeService.findById(req.params.id as string);
      if (!existing || existing.userId !== req.userId) {
        throw new AppError(404, 'Event type not found');
      }
      await EventTypeService.delete(req.params.id as string);
      res.status(204).send();
    } catch (error) { next(error); }
  }
}
