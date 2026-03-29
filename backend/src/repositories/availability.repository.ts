import { prisma } from '../db/index.js';
import type { Prisma } from '../generated/prisma/client.js';

export class AvailabilityRepository {
  static async upsert(data: Prisma.AvailabilityUncheckedCreateInput) {
    return prisma.availability.upsert({
      where: {
        scheduleId_dayOfWeek_startTime_endTime: {
          scheduleId: data.scheduleId,
          dayOfWeek: data.dayOfWeek,
          startTime: data.startTime,
          endTime: data.endTime,
        },
      },
      update: {},
      create: data,
    });
  }

  static async findByScheduleId(scheduleId: string) {
    return prisma.availability.findMany({
      where: { scheduleId },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  static async delete(id: string) {
    return prisma.availability.delete({ where: { id } });
  }

  // Overrides no longer have a composite unique, so we use create instead of upsert
  static async createOverride(data: Prisma.AvailabilityOverrideUncheckedCreateInput) {
    return prisma.availabilityOverride.create({ data });
  }

  static async getOverrides(scheduleId: string, date: string) {
    return prisma.availabilityOverride.findMany({
      where: { scheduleId, date },
    });
  }

  static async getAllOverrides(scheduleId: string) {
    return prisma.availabilityOverride.findMany({
      where: { scheduleId },
      orderBy: { date: 'asc' },
    });
  }

  static async deleteOverride(id: string) {
    return prisma.availabilityOverride.delete({ where: { id } });
  }

  static async getDefaultSchedule(userId: string) {
    // First try to find a schedule marked as default
    let schedule = await prisma.schedule.findFirst({
      where: { userId, isDefault: true },
    });

    // Fallback: find the oldest schedule
    if (!schedule) {
      schedule = await prisma.schedule.findFirst({
        where: { userId },
        orderBy: { createdAt: 'asc' },
      });
    }

    // Last resort: create a default schedule
    if (!schedule) {
      schedule = await prisma.schedule.create({
        data: { userId, name: 'Working Hours', isDefault: true },
      });
    }
    return schedule;
  }
}
