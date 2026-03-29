import { prisma } from '../db/index.js';
import type { Prisma } from '../generated/prisma/client.js';

export class ScheduleRepository {
  static async create(data: Prisma.ScheduleUncheckedCreateInput) {
    // If marking as default, unset any existing defaults for this user
    if (data.isDefault) {
      await prisma.schedule.updateMany({
        where: { userId: data.userId, isDefault: true },
        data: { isDefault: false },
      });
    }
    return prisma.schedule.create({ data });
  }

  static async findAll(userId: string) {
    return prisma.schedule.findMany({
      where: { userId },
      include: { availabilities: { orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }] }, overrides: { orderBy: { date: 'asc' } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  static async findById(id: string) {
    return prisma.schedule.findUnique({
      where: { id },
      include: { availabilities: { orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }] }, overrides: { orderBy: { date: 'asc' } } },
    });
  }

  static async update(id: string, data: Prisma.ScheduleUpdateInput & { userId?: string }) {
    // If marking as default, unset any existing defaults for this user
    if (data.isDefault === true && data.userId) {
      await prisma.schedule.updateMany({
        where: { userId: data.userId as string, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }
    const { userId, ...updateData } = data;
    return prisma.schedule.update({ where: { id }, data: updateData });
  }

  static async delete(id: string) {
    return prisma.schedule.delete({ where: { id } });
  }
}
