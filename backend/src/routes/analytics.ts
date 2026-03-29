import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { reportingQuerySchema } from '../validators/index.js';

const router = Router();

// Protected: Get reporting stats, query validation for start/end
router.get('/reporting', authenticate, validate(reportingQuerySchema, 'query'), AnalyticsController.getReporting);

// Protected: Get admin dashboard stats
router.get('/admin-dashboard', authenticate, AnalyticsController.getAdminDashboard);

export default router;
