import { Response, NextFunction } from 'express';
import { AvailabilityService } from '../services/availability.service.js';
import { AuthRequest } from '../middlewares/auth.js';
import { AppError } from '../utils/errors.js';
import { prisma } from '../db/index.js';

export class AvailabilityController {
  static async setAvailability(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const availability = await AvailabilityService.upsert({ ...req.body, userId: req.userId! });
      res.status(201).json({ status: 'success', data: availability });
    } catch (error) { next(error); }
  }

  static async getAvailability(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const scheduleId = req.query.scheduleId as string | undefined;
      const availabilities = scheduleId
        ? await AvailabilityService.findByScheduleId(scheduleId)
        : await AvailabilityService.findByUserId(req.userId!);
      res.status(200).json({ status: 'success', data: availabilities });
    } catch (error) { next(error); }
  }

  static async updateAvailability(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const availability = await prisma.availability.findUnique({
        where: { id: req.params.id as string },
        include: { schedule: { select: { userId: true } } },
      });
      if (!availability || availability.schedule.userId !== req.userId) {
        throw new AppError(404, 'Availability not found');
      }
      
      const { startTime, endTime } = req.body;
      const newStartTime = startTime || availability.startTime;
      const newEndTime = endTime || availability.endTime;
      
      if (newStartTime >= newEndTime) {
        throw new AppError(400, 'Start time must be before end time');
      }

      // Ensure no strict overlaps could occur using prisma unique constraint (handled by db directly if needed)
      const updated = await AvailabilityService.update(req.params.id as string, req.body);
      res.status(200).json({ status: 'success', data: updated });
    } catch (error) { next(error); }
  }

  static async deleteAvailability(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Ownership check: verify the availability belongs to a schedule owned by this user
      const availability = await prisma.availability.findUnique({
        where: { id: req.params.id as string },
        include: { schedule: { select: { userId: true } } },
      });
      if (!availability || availability.schedule.userId !== req.userId) {
        throw new AppError(404, 'Availability not found');
      }
      await AvailabilityService.delete(req.params.id as string);
      res.status(204).send();
    } catch (error) { next(error); }
  }

  static async setOverride(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const override = await AvailabilityService.upsertOverride({ ...req.body, userId: req.userId! });
      res.status(201).json({ status: 'success', data: override });
    } catch (error) { next(error); }
  }

  static async getOverrides(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const scheduleId = req.query.scheduleId as string | undefined;
      const overrides = scheduleId
        ? await AvailabilityService.getAllOverridesByScheduleId(scheduleId)
        : await AvailabilityService.getAllOverridesByUserId(req.userId!);
      res.status(200).json({ status: 'success', data: overrides });
    } catch (error) { next(error); }
  }

  static async deleteOverride(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Ownership check: verify the override belongs to a schedule owned by this user
      const override = await prisma.availabilityOverride.findUnique({
        where: { id: req.params.id as string },
        include: { schedule: { select: { userId: true } } },
      });
      if (!override || override.schedule.userId !== req.userId) {
        throw new AppError(404, 'Override not found');
      }
      await AvailabilityService.deleteOverride(req.params.id as string);
      res.status(204).send();
    } catch (error) { next(error); }
  }
}
