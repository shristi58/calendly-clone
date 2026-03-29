import { prisma } from '../db/index.js';

function parseTimestamp(val: string | undefined): Date | undefined {
  if (!val) return undefined;
  if (/^\d+$/.test(val)) {
    const num = Number(val);
    if (val.length <= 10) {
      return new Date(num * 1000);
    }
    return new Date(num);
  }
  const parsed = new Date(val);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

export class AnalyticsService {
  /**
   * Fetch aggregate booking stats for a given user.
   */
  static async getReportingStats(userId: string, start?: string, end?: string) {
    const startTime = parseTimestamp(start);
    const endTime = parseTimestamp(end);

    const userEventTypes = await prisma.eventType.findMany({
      where: { userId },
      select: { id: true },
    });
    
    if (userEventTypes.length === 0) {
      return {
        metrics: {
          createdEvents: 0,
          completedEvents: 0,
          rescheduledEvents: 0,
          canceledEvents: 0,
        },
        timeline: [],
      };
    }

    const eventTypeIds = userEventTypes.map(e => e.id);

    const whereClause: any = {
      eventTypeId: { in: eventTypeIds },
    };

    if (startTime || endTime) {
      whereClause.startTime = {};
      if (startTime) whereClause.startTime.gte = startTime;
      if (endTime) whereClause.startTime.lte = endTime;
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      select: {
        id: true,
        status: true,
        startTime: true,
        endTime: true,
        createdAt: true,
      },
    });

    let createdEvents = 0;
    let completedEvents = 0;
    let rescheduledEvents = 0;
    let canceledEvents = 0;
    
    const now = new Date();
    const timelineMap = new Map<string, number>();

    bookings.forEach(b => {
      createdEvents++;
      
      if (b.status === 'cancelled') {
        canceledEvents++;
      } else if (b.status === 'rescheduled') {
        rescheduledEvents++;
      } else if (b.endTime < now) {
        completedEvents++;
      }

      const dateStr = b.startTime.toISOString().split('T')[0];
      timelineMap.set(dateStr, (timelineMap.get(dateStr) || 0) + 1);
    });

    const timeline = Array.from(timelineMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      metrics: {
        createdEvents,
        completedEvents,
        rescheduledEvents,
        canceledEvents,
      },
      timeline,
    };
  }

  /**
   * Fetch admin dashboard high-level stats
   */
  static async getAdminDashboardStats(userId: string) {
    const teamMembersCount = await prisma.teamMember.count({
      where: {
        team: {
          members: {
            some: { userId: userId }
          }
        }
      }
    });

    const reporting = await this.getReportingStats(userId);
    
    return {
      activeUsers: teamMembersCount || 1,
      metrics: reporting.metrics,
      timeline: reporting.timeline,
    };
  }
}
