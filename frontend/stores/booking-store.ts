"use client";

import { create } from "zustand";
import { api } from "@/lib/api";
import type {
  Booking,
  BookingFilter,
  CancelBookingPayload,
  RescheduleBookingPayload,
} from "@/types";
import { toast } from "sonner";

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  activeFilter: BookingFilter;

  fetch: (filter?: BookingFilter) => Promise<void>;
  setFilter: (filter: BookingFilter) => void;
  cancel: (id: string, payload?: CancelBookingPayload) => Promise<void>;
  reschedule: (id: string, payload: RescheduleBookingPayload) => Promise<void>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  isLoading: false,
  activeFilter: "upcoming",

  setFilter: (filter) => {
    set({ activeFilter: filter });
    get().fetch(filter);
  },

  fetch: async (filter) => {
    const activeFilter = filter || get().activeFilter;
    set({ isLoading: true, activeFilter });
    try {
      const bookings = await api.get<Booking[]>(
        `/bookings?filter=${activeFilter}`
      );
      set({ bookings });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load meetings";
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  cancel: async (id, payload) => {
    // Optimistic cancel
    const prev = get().bookings;
    set({
      bookings: prev.map((b) =>
        b.id === id
          ? { ...b, status: "cancelled" as const, cancelReason: payload?.cancelReason || null }
          : b
      ),
    });
    try {
      await api.patch(`/bookings/${id}/cancel`, payload);
      toast.success("Meeting cancelled");
      // Re-fetch to update the list properly
      get().fetch();
    } catch (err) {
      // Revert
      set({ bookings: prev });
      const message =
        err instanceof Error ? err.message : "Failed to cancel meeting";
      toast.error(message);
    }
  },

  reschedule: async (id, payload) => {
    try {
      await api.patch(`/bookings/${id}/reschedule`, payload);
      toast.success("Meeting rescheduled");
      get().fetch();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to reschedule meeting";
      toast.error(message);
    }
  },
}));
