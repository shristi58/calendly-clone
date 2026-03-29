import { prisma } from '../db/index.js';
import type { Prisma } from '../generated/prisma/client.js';

export class BookingRepository {
  static async create(data: Prisma.BookingUncheckedCreateInput) {
    return prisma.booking.create({ data });
  }

  static async findOverlappingBookings(eventTypeId: string, startTime: Date, endTime: Date) {
    return prisma.booking.findMany({
      where: {
        eventTypeId,
        status: 'scheduled',
        OR: [
          {
            startTime: { lt: endTime },
            endTime: { gt: startTime }
          }
        ]
      }
    });
  }

  static async findBookingsForDate(eventTypeId: string, startOfDay: Date, endOfDay: Date) {
    return prisma.booking.findMany({
      where: {
        eventTypeId,
        status: 'scheduled',
        startTime: { gte: startOfDay, lte: endOfDay }
      }
    });
  }

  static async findByEventTypeId(eventTypeId: string) {
    return prisma.booking.findMany({ where: { eventTypeId } });
  }

  static async findById(id: string) {
    return prisma.booking.findUnique({ where: { id } });
  }

  static async delete(id: string) {
    return prisma.booking.delete({ where: { id } });
  }
}
