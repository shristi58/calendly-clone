import { QuestionRepository } from '../repositories/question.repository.js';
import type { Prisma } from '../generated/prisma/client.js';

export class QuestionService {
  static create(data: Prisma.QuestionUncheckedCreateInput) {
    return QuestionRepository.create(data);
  }

  static findByEventTypeId(eventTypeId: string) {
    return QuestionRepository.findByEventTypeId(eventTypeId);
  }

  static findById(id: string) {
    return QuestionRepository.findById(id);
  }

  static update(id: string, data: Prisma.QuestionUpdateInput) {
    return QuestionRepository.update(id, data);
  }

  static delete(id: string) {
    return QuestionRepository.delete(id);
  }
}
