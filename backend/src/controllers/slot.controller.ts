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

  /**
   * GET /api/slots/:eventTypeId?date=...&timezone=...
   * Path-parameter style (used by the frontend booking page)
   */
  static async getSlotsByPath(req: Request, res: Response, next: NextFunction) {
    try {
      const eventTypeId = req.params.eventTypeId as string;
      const date = req.query.date as string;

      if (!date) {
        res.status(400).json({ status: 'fail', message: 'date query parameter is required' });
        return;
      }

      const slots = await BookingService.generateAvailableSlots(eventTypeId, date);
      res.status(200).json({ status: 'success', data: slots });
    } catch (error) { next(error); }
  }
}
