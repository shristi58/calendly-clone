import { EventTypeRepository } from '../repositories/event-type.repository.js';
import { AvailabilityService } from './availability.service.js';
import { prisma } from '../db/index.js';
import { parse, addMinutes, isBefore, isAfter, isEqual, startOfDay, endOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { AppError } from '../utils/errors.js';
import type { Booking } from '../generated/prisma/client.js';

export class BookingService {
  // ─────────────────────────────────────────────────
  // Slot Generation
  // ─────────────────────────────────────────────────

  static async generateAvailableSlots(eventTypeId: string, dateString: string) {
    const eventType = await EventTypeRepository.findById(eventTypeId) as any;
    if (!eventType) throw new AppError(404, 'Event type not found');
    if (!eventType.isActive) throw new AppError(400, 'This event type is currently unavailable');

    const targetDate = new Date(dateString);

    // Determine which users need their availability checked
    const usersToCheck: string[] = [];
    if (eventType.schedulingType !== 'solo' && eventType.team?.members?.length > 0) {
      usersToCheck.push(...eventType.team.members.map((m: any) => m.userId));
    } else {
      usersToCheck.push(eventType.userId);
    }

    // Get available slots for all relevant users
    const userSlotsPromises = usersToCheck.map(userId =>
      this.getAvailableSlotsForUser(
        userId,
        targetDate,
        eventType.duration,
        eventType.bufferBefore,
        eventType.bufferAfter,
        eventType.scheduleId,
        eventType.userId
      )
    );

    const allUserSlots = await Promise.all(userSlotsPromises);

    if (eventType.schedulingType === 'collective') {
      // Intersection: all users must be available
      if (allUserSlots.length === 0) return [];
      let collectiveSlots = allUserSlots[0];
      for (let i = 1; i < allUserSlots.length; i++) {
        collectiveSlots = collectiveSlots.filter(slot => allUserSlots[i].includes(slot));
      }
      return collectiveSlots;
    } else {
      // Round_robin or Solo: Union of available slots
      const unionSlots = new Set<string>();
      for (const slots of allUserSlots) {
        slots.forEach(slot => unionSlots.add(slot));
      }
      return Array.from(unionSlots).sort();
    }
  }

  private static async getAvailableSlotsForUser(
    userId: string,
    targetDate: Date,
    duration: number,
    bufferBefore: number,
    bufferAfter: number,
    eventTypeScheduleId: string | null,
    creatorUserId: string
  ): Promise<string[]> {
    // Fetch user's timezone for correct day-of-week and date resolution
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { timezone: true } });
    const userTimezone = user?.timezone || 'UTC';

    // Convert target date to user's local timezone before extracting day/date
    const zonedDate = toZonedTime(targetDate, userTimezone);
    const dayOfWeek = zonedDate.getDay();
    const dateString = zonedDate.toISOString().split('T')[0];

    // Use specific schedule if provided, otherwise user's default
    let scheduleId = eventTypeScheduleId;
    if (!scheduleId) {
      scheduleId = await AvailabilityService.getDefaultScheduleId(userId);
    }

    const availabilities = await AvailabilityService.findByScheduleId(scheduleId);
    const dayAvailabilities = availabilities.filter(a => a.dayOfWeek === dayOfWeek);
    const overrides = await AvailabilityService.getOverridesByScheduleId(scheduleId, dateString);

    let activeRanges: Array<{ start: string; end: string }> = [];

    if (overrides.length > 0) {
      for (const override of overrides) {
        if (override.startTime && override.endTime) {
          activeRanges.push({ start: override.startTime, end: override.endTime });
        }
        // If startTime/endTime are null, the day is fully blocked — activeRanges stays empty
      }
    } else {
      activeRanges = dayAvailabilities.map((a: { startTime: string; endTime: string }) => ({
        start: a.startTime,
        end: a.endTime,
      }));
    }

    if (activeRanges.length === 0) {
      return [];
    }

    const dayStart = startOfDay(targetDate);
    const dayEnd = endOfDay(targetDate);

    // Fetch existing bookings and external busy times in parallel
    const userBookingsP = prisma.booking.findMany({
      where: {
        eventType: { userId: creatorUserId },
        status: 'scheduled',
        startTime: { gte: dayStart, lte: dayEnd },
      },
    });

    let externalBusyP: Promise<{ start: Date; end: Date }[]>;
    try {
      const calModule = await import('./calendar.service.js');
      externalBusyP = calModule.CalendarService.getUserBusyTimes(userId, dayStart, dayEnd);
    } catch {
      externalBusyP = Promise.resolve([]);
    }

    const [userBookings, externalBusyTimes] = await Promise.all([userBookingsP, externalBusyP]);

    const slots: string[] = [];
    const now = new Date();

    for (const range of activeRanges) {
      let currentSlotTime = parse(range.start, 'HH:mm', targetDate);
      const limitTime = parse(range.end, 'HH:mm', targetDate);

      while (
        isBefore(addMinutes(currentSlotTime, duration), limitTime) ||
        isEqual(addMinutes(currentSlotTime, duration), limitTime)
      ) {
        const slotEnd = addMinutes(currentSlotTime, duration);

        // Skip slots in the past
        if (isBefore(currentSlotTime, now)) {
          currentSlotTime = addMinutes(currentSlotTime, duration);
          continue;
        }

        const bufferedStart = addMinutes(currentSlotTime, -bufferBefore);
        const bufferedEnd = addMinutes(slotEnd, bufferAfter);

        let overlaps = userBookings.some((booking: Booking) => {
          const bookingBufferedStart = addMinutes(booking.startTime, -bufferBefore);
          const bookingBufferedEnd = addMinutes(booking.endTime, bufferAfter);
          return (
            isBefore(bufferedStart, bookingBufferedEnd) && isAfter(bufferedEnd, bookingBufferedStart)
          );
        });

        if (!overlaps) {
          overlaps = externalBusyTimes.some(busy => {
            return isBefore(bufferedStart, busy.end) && isAfter(bufferedEnd, busy.start);
          });
        }

        if (!overlaps) {
          slots.push(currentSlotTime.toISOString());
        }

        currentSlotTime = addMinutes(currentSlotTime, duration);
      }
    }

    return slots;
  }

  // ─────────────────────────────────────────────────
  // Create Booking (with Serializable isolation to prevent double-booking)
  // ─────────────────────────────────────────────────

  static async createBooking(data: {
    eventTypeId: string;
    inviteeName: string;
    inviteeEmail: string;
    startTime: string;
    timezone?: string;
    answers?: { questionId: string; answer: string }[];
  }) {
    const eventType = await EventTypeRepository.findById(data.eventTypeId);
    if (!eventType) throw new AppError(404, 'Event type not found');
    if (!eventType.isActive) throw new AppError(400, 'This event type is currently unavailable');

    const requestedStartTime = new Date(data.startTime);
    const requestedEndTime = addMinutes(requestedStartTime, eventType.duration);

    // Validate start time is in the future
    if (isBefore(requestedStartTime, new Date())) {
      throw new AppError(400, 'Cannot book a time slot in the past');
    }

    // Use SERIALIZABLE isolation to prevent concurrent double-booking
    const booking = await prisma.$transaction(async (tx) => {
      // Check for overlapping bookings considering buffer times
      const bufferedStart = addMinutes(requestedStartTime, -eventType.bufferBefore);
      const bufferedEnd = addMinutes(requestedEndTime, eventType.bufferAfter);

      const overlapping = await tx.booking.findMany({
        where: {
          eventType: { userId: eventType.userId },
          status: 'scheduled',
          startTime: { lt: bufferedEnd },
          endTime: { gt: bufferedStart },
        },
      });

      if (overlapping.length > 0) {
        throw new AppError(409, 'Time slot is already booked');
      }

      return tx.booking.create({
        data: {
          eventTypeId: eventType.id,
          inviteeName: data.inviteeName,
          inviteeEmail: data.inviteeEmail,
          startTime: requestedStartTime,
          endTime: requestedEndTime,
          timezone: data.timezone || 'UTC',
          ...(data.answers && data.answers.length > 0
            ? {
                answers: {
                  create: data.answers.map(a => ({
                    questionId: a.questionId,
                    answer: a.answer,
                  })),
                },
              }
            : {}),
        },
        include: {
          answers: { include: { question: true } },
          eventType: { select: { name: true, slug: true, duration: true } },
        },
      });
    }, {
      isolationLevel: 'Serializable',
    });

    // Post-booking: push to external calendar (non-blocking)
    this.syncToExternalCalendar(booking.id, eventType, data).catch(err =>
      console.error(`Post-booking calendar sync failed for booking ${booking.id}:`, err)
    );

    // Enqueue confirmation email (non-blocking)
    this.enqueueEmail('confirmation', booking.id).catch(err =>
      console.error('Failed to enqueue confirmation email:', err)
    );

    return booking;
  }

  // ─────────────────────────────────────────────────
  // Read Operations
  // ─────────────────────────────────────────────────

  static async findById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        eventType: {
          include: { user: { select: { name: true, email: true, timezone: true } } },
        },
        answers: { include: { question: true } },
      },
    });
  }

  static async findAllForUser(userId: string, filter?: string) {
    const now = new Date();
    const baseWhere: Record<string, unknown> = { eventType: { userId } };

    if (filter === 'upcoming') {
      baseWhere.startTime = { gte: now };
      baseWhere.status = 'scheduled';
    } else if (filter === 'past') {
      baseWhere.startTime = { lt: now };
    } else if (filter === 'cancelled') {
      baseWhere.status = 'cancelled';
    }

    return prisma.booking.findMany({
      where: baseWhere,
      include: {
        eventType: { select: { name: true, slug: true, duration: true, color: true } },
        answers: { include: { question: true } },
      },
      orderBy: { startTime: filter === 'past' ? 'desc' : 'asc' },
    });
  }

  // ─────────────────────────────────────────────────
  // Cancel Booking
  // ─────────────────────────────────────────────────

  static async cancelBooking(bookingId: string, userId: string, cancelReason?: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { eventType: true },
    });

    if (!booking) throw new AppError(404, 'Booking not found');
    if (booking.eventType.userId !== userId) throw new AppError(403, 'Not authorized');
    if (booking.status === 'cancelled') throw new AppError(400, 'Booking already cancelled');

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'cancelled',
        cancelReason: cancelReason || null,
      },
    });

    this.enqueueEmail('cancellation', booking.id, cancelReason).catch(err =>
      console.error('Failed to enqueue cancellation email:', err)
    );

    return updated;
  }

  // ─────────────────────────────────────────────────
  // Reschedule Booking (with Serializable isolation + buffer checks)
  // ─────────────────────────────────────────────────

  static async rescheduleBooking(bookingId: string, userId: string, newStartTime: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { eventType: true },
    });

    if (!booking) throw new AppError(404, 'Booking not found');
    if (booking.eventType.userId !== userId) throw new AppError(403, 'Not authorized');
    if (booking.status === 'cancelled') throw new AppError(400, 'Cannot reschedule a cancelled booking');

    const requestedStart = new Date(newStartTime);
    const requestedEnd = addMinutes(requestedStart, booking.eventType.duration);

    // Validate start time is in the future
    if (isBefore(requestedStart, new Date())) {
      throw new AppError(400, 'Cannot reschedule to a time in the past');
    }

    return prisma.$transaction(async (tx) => {
      // Check for overlapping bookings WITH buffer time (was missing before)
      const bufferedStart = addMinutes(requestedStart, -booking.eventType.bufferBefore);
      const bufferedEnd = addMinutes(requestedEnd, booking.eventType.bufferAfter);

      const overlapping = await tx.booking.findMany({
        where: {
          eventType: { userId: booking.eventType.userId },
          status: 'scheduled',
          id: { not: bookingId },
          startTime: { lt: bufferedEnd },
          endTime: { gt: bufferedStart },
        },
      });

      if (overlapping.length > 0) {
        throw new AppError(409, 'New time slot is already booked');
      }

      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: {
          startTime: requestedStart,
          endTime: requestedEnd,
          status: 'scheduled', // Reset status if it was 'rescheduled'
        },
      });

      // Fire-and-forget email (outside transaction)
      this.enqueueEmail('reschedule', bookingId).catch(err =>
        console.error('Failed to enqueue reschedule email:', err)
      );

      return updated;
    }, {
      isolationLevel: 'Serializable',
    });
  }

  // ─────────────────────────────────────────────────
  // Private Helpers
  // ─────────────────────────────────────────────────

  private static async syncToExternalCalendar(
    bookingId: string,
    eventType: any,
    data: { inviteeName: string; inviteeEmail: string; startTime: string }
  ) {
    try {
      const { CalendarService } = await import('./calendar.service.js');
      const requestedStartTime = new Date(data.startTime);
      const requestedEndTime = addMinutes(requestedStartTime, eventType.duration);
      const externalEvent = await CalendarService.createEvent(eventType.userId, {
        summary: `${eventType.name} with ${data.inviteeName}`,
        description: `Booking for ${eventType.name}\nInvitee: ${data.inviteeName} (${data.inviteeEmail})`,
        startTime: requestedStartTime,
        endTime: requestedEndTime,
        attendees: [data.inviteeEmail],
      });

      if (externalEvent.meetingLink) {
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            meetingLink: externalEvent.meetingLink,
            meetingProvider: externalEvent.provider,
          },
        });
      }
    } catch (error) {
      // Non-fatal: log and continue
      console.error(`Calendar sync failed for booking ${bookingId}:`, error);
    }
  }

  private static async enqueueEmail(type: 'confirmation' | 'cancellation' | 'reschedule', bookingId: string, reason?: string) {
    try {
      const queue = await import('../jobs/email.queue.js');
      switch (type) {
        case 'confirmation':
          await queue.enqueueBookingConfirmation(bookingId);
          break;
        case 'cancellation':
          await queue.enqueueBookingCancellation(bookingId, reason);
          break;
        case 'reschedule':
          await queue.enqueueBookingReschedule(bookingId);
          break;
      }
    } catch (err) {
      console.error(`Failed to enqueue ${type} email for booking ${bookingId}:`, err);
    }
  }
}
