import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createBookingSchema, rescheduleBookingSchema, cancelBookingSchema } from '../validators/index.js';

const router = Router();

// Public: create a booking (invitee doesn't need auth)
router.post('/', validate(createBookingSchema), BookingController.create);

// Public: view booking confirmation by id
router.get('/confirm/:id', BookingController.findById);

// Protected: list user's bookings (with ?filter=upcoming|past|cancelled)
router.get('/', authenticate, BookingController.findAll);

// Protected: cancel a booking
router.patch('/:id/cancel', authenticate, validate(cancelBookingSchema), BookingController.cancel);

// Protected: reschedule a booking
router.patch('/:id/reschedule', authenticate, validate(rescheduleBookingSchema), BookingController.reschedule);

export default router;
