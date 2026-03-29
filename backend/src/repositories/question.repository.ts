import { prisma } from '../db/index.js';
import type { Prisma } from '../generated/prisma/client.js';

export class QuestionRepository {
  static async create(data: Prisma.QuestionUncheckedCreateInput) {
    return prisma.question.create({ data });
  }

  static async findByEventTypeId(eventTypeId: string) {
    return prisma.question.findMany({ where: { eventTypeId } });
  }

  static async findById(id: string) {
    return prisma.question.findUnique({
      where: { id },
      include: { eventType: true }
    });
  }

  static async update(id: string, data: Prisma.QuestionUpdateInput) {
    return prisma.question.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.question.delete({ where: { id } });
  }
}
