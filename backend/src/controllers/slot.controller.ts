import { Request, Response, NextFunction } from 'express';
import { BookingService } from '../services/booking.service.js';

export class SlotController {
  static async getSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const eventTypeId = req.query.eventTypeId as string;
      const date = req.query.date as string;

      if (!eventTypeId || !date) {
        res.status(400).json({ status: 'fail', message: 'eventTypeId and date are required' });
        return;
      }

      const slots = await BookingService.generateAvailableSlots(eventTypeId, date);
      res.status(200).json({ status: 'success', data: slots });
    } catch (error) { next(error); }
  }
}
