"use client";

import { useEffect, useRef } from "react";
import { useBookingStore } from "@/stores/booking-store";
import type { BookingFilter } from "@/types";

export function useBookings(initialFilter?: BookingFilter) {
  const { bookings, isLoading, activeFilter, fetch, setFilter } =
    useBookingStore();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetch(initialFilter);
    }
  }, [fetch, initialFilter]);

  return { bookings, isLoading, activeFilter, setFilter };
}
