import { EventTypeRepository } from '../repositories/event-type.repository.js';
import type { Prisma } from '../generated/prisma/client.js';

export class EventTypeService {
  static create(data: Prisma.EventTypeUncheckedCreateInput) {
    return EventTypeRepository.create(data);
  }

  static findAll(userId: string) {
    return EventTypeRepository.findAll(userId);
  }

  static findById(id: string) {
    return EventTypeRepository.findById(id);
  }

  static findBySlug(slug: string) {
    return EventTypeRepository.findBySlug(slug);
  }

  static update(id: string, data: Prisma.EventTypeUpdateInput) {
    return EventTypeRepository.update(id, data);
  }

  static delete(id: string) {
    return EventTypeRepository.delete(id);
  }
}
