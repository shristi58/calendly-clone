import { Response, NextFunction } from 'express';
import { ScheduleService } from '../services/schedule.service.js';
import { AuthRequest } from '../middlewares/auth.js';
import { AppError } from '../utils/errors.js';

export class ScheduleController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schedule = await ScheduleService.create({ ...req.body, userId: req.userId! });
      res.status(201).json({ status: 'success', data: schedule });
    } catch (error) { next(error); }
  }

  static async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schedules = await ScheduleService.findAll(req.userId!);
      res.status(200).json({ status: 'success', data: schedules });
    } catch (error) { next(error); }
  }

  static async findById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const schedule = await ScheduleService.findById(req.params.id as string);
      if (!schedule || schedule.userId !== req.userId) {
        throw new AppError(404, 'Schedule not found');
      }
      res.status(200).json({ status: 'success', data: schedule });
    } catch (error) { next(error); }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const existing = await ScheduleService.findById(req.params.id as string);
      if (!existing || existing.userId !== req.userId) {
        throw new AppError(404, 'Schedule not found');
      }
      const schedule = await ScheduleService.update(req.params.id as string, { ...req.body, userId: req.userId! });
      res.status(200).json({ status: 'success', data: schedule });
    } catch (error) { next(error); }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const existing = await ScheduleService.findById(req.params.id as string);
      if (!existing || existing.userId !== req.userId) {
        throw new AppError(404, 'Schedule not found');
      }
      await ScheduleService.delete(req.params.id as string);
      res.status(204).send();
    } catch (error) { next(error); }
  }
}
