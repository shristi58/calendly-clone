import { Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';
import { AuthRequest } from '../middlewares/auth.js';

export class AnalyticsController {
  static async getReporting(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { start, end } = req.query as { start?: string, end?: string };
      const data = await AnalyticsService.getReportingStats(req.userId!, start, end);
      res.status(200).json({ status: 'success', data });
    } catch (error) {
      next(error);
    }
  }

  static async getAdminDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getAdminDashboardStats(req.userId!);
      res.status(200).json({ status: 'success', data });
    } catch (error) {
      next(error);
    }
  }
}
