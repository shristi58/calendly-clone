import { ScheduleRepository } from '../repositories/schedule.repository.js';
import type { Prisma } from '../generated/prisma/client.js';

export class ScheduleService {
  static create(data: Prisma.ScheduleUncheckedCreateInput) {
    return ScheduleRepository.create(data);
  }

  static findAll(userId: string) {
    return ScheduleRepository.findAll(userId);
  }

  static findById(id: string) {
    return ScheduleRepository.findById(id);
  }

  static update(id: string, data: Prisma.ScheduleUpdateInput & { userId?: string }) {
    return ScheduleRepository.update(id, data);
  }

  static delete(id: string) {
    return ScheduleRepository.delete(id);
  }
}
