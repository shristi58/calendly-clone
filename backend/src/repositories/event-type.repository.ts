import { prisma } from '../db/index.js';
import type { Prisma } from '../generated/prisma/client.js';

export class EventTypeRepository {
  static async create(data: Prisma.EventTypeUncheckedCreateInput) {
    return prisma.eventType.create({ data });
  }

  static async findAll(userId: string) {
    return prisma.eventType.findMany({
      where: { userId },
      include: {
        questions: { orderBy: { order: 'asc' } },
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async findById(id: string) {
    return prisma.eventType.findUnique({
      where: { id },
      include: {
        team: { include: { members: true } },
        questions: { orderBy: { order: 'asc' } },
      },
    });
  }

  static async findBySlug(slug: string) {
    return prisma.eventType.findUnique({
      where: { slug },
      include: {
        user: { select: { id: true, name: true, timezone: true } },
        team: { include: { members: true } },
        questions: {
          where: { eventType: { isActive: true } },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  static async update(id: string, data: Prisma.EventTypeUpdateInput) {
    return prisma.eventType.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.eventType.delete({ where: { id } });
  }
}
