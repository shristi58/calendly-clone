"use client";

import { Suspense, useState, useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { ConfirmationCard } from "@/components/booking/confirmation-card";
import { CalendarSkeleton } from "@/components/shared/loading-skeleton";
import { CalendlyLogo } from "@/components/shared/calendly-logo";
import type { Booking } from "@/types";

function ConfirmationContent({ username }: { username: string }) {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBooking() {
      if (!bookingId) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await api.get<Booking>(`/bookings/confirm/${bookingId}`);
        setBooking(data);
      } catch {
        try {
          const data = await api.get<Booking>(`/bookings/${bookingId}`);
          setBooking(data);
        } catch {
          // Silently handle
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadBooking();
  }, [bookingId]);

  if (isLoading) {
    return <CalendarSkeleton />;
  }

  if (!booking) {
    return (
      <div className="text-center py-8">
        <h1 className="text-xl font-semibold text-foreground mb-2">
          Booking not found
        </h1>
        <p className="text-sm text-muted-foreground">
          This confirmation page is no longer available.
        </p>
      </div>
    );
  }

  return (
    <ConfirmationCard
      booking={booking}
      eventName={booking.eventType?.name || "Meeting"}
      hostName={username}
    />
  );
}

export default function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ username: string; eventSlug: string }>;
}) {
  const { username } = use(params);

  return (
    <div className="min-h-screen bg-booking-page flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[600px] bg-card rounded-2xl shadow-calendly-lg p-8 lg:p-12">
        <Suspense fallback={<CalendarSkeleton />}>
          <ConfirmationContent username={username} />
        </Suspense>
      </div>

      {/* Powered by Calendly */}
      <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
        <span>powered by</span>
        <CalendlyLogo size="sm" />
      </div>
    </div>
  );
}
