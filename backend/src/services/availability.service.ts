import { AvailabilityRepository } from '../repositories/availability.repository.js';
import type { Prisma } from '../generated/prisma/client.js';

export class AvailabilityService {
  static async getDefaultScheduleId(userId: string) {
    const schedule = await AvailabilityRepository.getDefaultSchedule(userId);
    return schedule.id;
  }

  static async upsert(data: Prisma.AvailabilityUncheckedCreateInput & { userId?: string }) {
    if (!data.scheduleId && data.userId) {
      data.scheduleId = await this.getDefaultScheduleId(data.userId);
    }
    // Remove userId before passing to repo (not a DB column on Availability)
    const { userId, ...repoData } = data as any;
    return AvailabilityRepository.upsert(repoData);
  }

  static async findByUserId(userId: string) {
    const scheduleId = await this.getDefaultScheduleId(userId);
    return AvailabilityRepository.findByScheduleId(scheduleId);
  }

  static async findByScheduleId(scheduleId: string) {
    return AvailabilityRepository.findByScheduleId(scheduleId);
  }

  static delete(id: string) {
    return AvailabilityRepository.delete(id);
  }

  static async upsertOverride(data: Prisma.AvailabilityOverrideUncheckedCreateInput & { userId?: string }) {
    if (!data.scheduleId && data.userId) {
      data.scheduleId = await this.getDefaultScheduleId(data.userId);
    }
    const { userId, ...repoData } = data as any;
    return AvailabilityRepository.createOverride(repoData);
  }

  static async getOverridesByUserId(userId: string, date: string) {
    const scheduleId = await this.getDefaultScheduleId(userId);
    return AvailabilityRepository.getOverrides(scheduleId, date);
  }

  static async getOverridesByScheduleId(scheduleId: string, date: string) {
    return AvailabilityRepository.getOverrides(scheduleId, date);
  }

  static async getAllOverridesByScheduleId(scheduleId: string) {
    return AvailabilityRepository.getAllOverrides(scheduleId);
  }

  static async getAllOverridesByUserId(userId: string) {
    const scheduleId = await this.getDefaultScheduleId(userId);
    return AvailabilityRepository.getAllOverrides(scheduleId);
  }

  static deleteOverride(id: string) {
    return AvailabilityRepository.deleteOverride(id);
  }
}
