"use client";

import { useState, useEffect, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getTimezone, getTimezoneLabel } from "@/lib/auth";
import { EventDetailsPanel } from "@/components/booking/event-details-panel";
import { BookingCalendar } from "@/components/booking/calendar";
import { TimeSlots } from "@/components/booking/time-slots";
import { BookingForm } from "@/components/booking/booking-form";
import { CalendarSkeleton, FormSkeleton } from "@/components/shared/loading-skeleton";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import type { EventType, CreateBookingPayload, Booking } from "@/types";
import type { BookingFormData } from "@/lib/validators";

export default function BookingPage({
  params,
}: {
  params: Promise<{ username: string; eventSlug: string }>;
}) {
  const { username, eventSlug } = use(params);
  const router = useRouter();

  const [event, setEvent] = useState<EventType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1); // 1: calendar, 2: form
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timezone = getTimezone();

  // Fetch event type
  useEffect(() => {
    async function loadEvent() {
      try {
        const data = await api.get<EventType>(
          `/event-types/slug/${eventSlug}`
        );
        setEvent(data);
      } catch {
        toast.error("Event not found");
      } finally {
        setIsLoading(false);
      }
    }
    loadEvent();
  }, [eventSlug]);

  // Fetch slots when date changes
  const fetchSlots = useCallback(async (date: Date, eventId: string) => {
    setSlotsLoading(true);
    try {
      const dateStr = format(date, "yyyy-MM-dd");
      const rawSlots = await api.get<string[]>(
        `/slots/${eventId}?date=${dateStr}&timezone=${timezone}`
      );

      // Convert UTC ISO strings to display times in user's timezone
      const displaySlots = rawSlots.map((isoStr) => {
        const dt = parseISO(isoStr);
        return format(dt, "h:mma").toLowerCase();
      });

      setSlots(displaySlots);
    } catch {
      setSlots([]);
      toast.error("Failed to load available times");
    } finally {
      setSlotsLoading(false);
    }
  }, [timezone]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    if (event) {
      fetchSlots(date, event.id);
    }
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedSlot(null);
  };

  const handleBookingSubmit = async (
    data: BookingFormData & { answers: Record<string, string> }
  ) => {
    if (!event || !selectedDate || !selectedSlot) return;

    setIsSubmitting(true);
    try {
      // Reconstruct the ISO string from the selected date and slot
      // The slot is like "5:30pm" — we need to build a full datetime
      const dateStr = format(selectedDate, "yyyy-MM-dd");

      // Find the matching ISO slot from the API response
      const rawSlots = await api.get<string[]>(
        `/slots/${event.id}?date=${dateStr}&timezone=${timezone}`
      );

      const matchingSlot = rawSlots.find((isoStr) => {
        const dt = parseISO(isoStr);
        return format(dt, "h:mma").toLowerCase() === selectedSlot;
      });

      if (!matchingSlot) {
        toast.error("Selected time is no longer available");
        return;
      }

      // Build answers array
      const answers = Object.entries(data.answers)
        .filter(([, value]) => value.trim() !== "")
        .map(([questionId, answer]) => ({
          questionId,
          answer,
        }));

      const payload: CreateBookingPayload = {
        eventTypeId: event.id,
        inviteeName: data.inviteeName,
        inviteeEmail: data.inviteeEmail,
        startTime: matchingSlot,
        timezone,
        answers: answers.length > 0 ? answers : undefined,
      };

      const booking = await api.post<Booking>("/bookings", payload);
      router.push(
        `/${username}/${eventSlug}/confirmation?id=${booking.id}`
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to schedule event";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
        <div className="w-full max-w-[1100px] bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E5E5E5]">
          <div className="flex flex-col lg:flex-row min-h-[600px]">
            <div className="w-full lg:w-[320px] p-8 border-r border-[#E5E5E5]">
              <FormSkeleton fields={4} />
            </div>
            <div className="flex-1 p-8">
              <CalendarSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Event not found
  if (!event) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-xl border border-[#E5E5E5]">
          <h1 className="text-[20px] font-bold text-[#1A1A1A] mb-2">
            Event not found
          </h1>
          <p className="text-[14px] text-[#666666]">
            This event type doesn&apos;t exist or is no longer available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
      <div className="w-full max-w-[1100px] bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E5E5E5]">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Left Panel — Event details */}
          <EventDetailsPanel
            event={event}
            selectedDate={selectedDate}
            selectedTime={selectedSlot}
            step={step}
            onBack={handleBack}
          />

          {/* Right Panel */}
          <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
            {step === 1 ? (
              <div>
                {/* Heading */}
                <h2 className="text-[16px] font-bold text-[#1A1A1A] mb-6">
                  Select a Date & Time
                </h2>

                <div className="flex flex-col xl:flex-row gap-8">
                  {/* Calendar */}
                  <div className="flex-1 min-w-[280px]">
                    <BookingCalendar
                      selectedDate={selectedDate}
                      onDateSelect={handleDateSelect}
                    />
                  </div>

                  {/* Time slots */}
                  {selectedDate && (
                    <div className="w-full xl:w-[240px] shrink-0">
                      {slotsLoading ? (
                        <div className="flex flex-col gap-2">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <div
                              key={i}
                              className="h-[52px] rounded-lg bg-muted animate-pulse"
                            />
                          ))}
                        </div>
                      ) : (
                        <TimeSlots
                          date={selectedDate}
                          slots={slots}
                          onSlotSelect={handleSlotSelect}
                          timezone={timezone}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Step 2 — Booking Form */
              <div className="max-w-md">
                <BookingForm
                  questions={event.questions || []}
                  onSubmit={handleBookingSubmit}
                  isSubmitting={isSubmitting}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
