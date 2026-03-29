import { Response, NextFunction } from 'express';
import { BookingService } from '../services/booking.service.js';
import { AuthRequest } from '../middlewares/auth.js';
import { AppError } from '../utils/errors.js';

export class BookingController {
  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const booking = await BookingService.createBooking(req.body);
      res.status(201).json({ status: 'success', data: booking });
    } catch (error) { next(error); }
  }

  static async findById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const booking = await BookingService.findById(req.params.id as string);
      if (!booking) {
        res.status(404).json({ status: 'fail', message: 'Booking not found' });
        return;
      }
      res.status(200).json({ status: 'success', data: booking });
    } catch (error) { next(error); }
  }

  static async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const filter = req.query.filter as string | undefined;
      const bookings = await BookingService.findAllForUser(req.userId!, filter);
      res.status(200).json({ status: 'success', data: bookings });
    } catch (error) { next(error); }
  }

  static async cancel(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const cancelReason = req.body?.cancelReason as string | undefined;
      const booking = await BookingService.cancelBooking(req.params.id as string, req.userId!, cancelReason);
      res.status(200).json({ status: 'success', data: booking });
    } catch (error) { next(error); }
  }

  static async reschedule(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const booking = await BookingService.rescheduleBooking(
        req.params.id as string,
        req.userId!,
        req.body.startTime
      );
      res.status(200).json({ status: 'success', data: booking });
    } catch (error) { next(error); }
  }
}
