import { Router } from 'express';
import authRoutes from './auth.js';
import oauthRoutes from './oauth.routes.js';
import eventTypeRoutes from './event-types.js';
import availabilityRoutes from './availability.js';
import bookingRoutes from './bookings.js';
import slotRoutes from './slots.js';
import scheduleRoutes from './schedules.js';
import questionRoutes from './questions.js';
import analyticsRoutes from './analytics.js';

const router = Router();

router.use('/auth', oauthRoutes);
router.use('/auth', authRoutes);
router.use('/event-types', eventTypeRoutes);
router.use('/availability', availabilityRoutes);
router.use('/bookings', bookingRoutes);
router.use('/slots', slotRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/questions', questionRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
