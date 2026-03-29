"use client";

import { create } from "zustand";
import { api } from "@/lib/api";
import type {
  Schedule,
  Availability,
  AvailabilityOverride,
  CreateSchedulePayload,
  CreateAvailabilityPayload,
  CreateOverridePayload,
} from "@/types";
import { toast } from "sonner";

interface AvailabilityState {
  schedules: Schedule[];
  activeScheduleId: string | null;
  isLoading: boolean;

  fetchSchedules: () => Promise<void>;
  setActiveSchedule: (id: string) => void;
  createSchedule: (data: CreateSchedulePayload) => Promise<Schedule | undefined>;
  deleteSchedule: (id: string) => Promise<void>;

  addRule: (data: CreateAvailabilityPayload) => Promise<void>;
  updateRule: (id: string, data: Partial<CreateAvailabilityPayload>) => Promise<void>;
  deleteRule: (id: string) => Promise<void>;

  addOverride: (data: CreateOverridePayload) => Promise<void>;
  deleteOverride: (id: string) => Promise<void>;

  getActiveSchedule: () => Schedule | undefined;
}

export const useAvailabilityStore = create<AvailabilityState>((set, get) => ({
  schedules: [],
  activeScheduleId: null,
  isLoading: false,

  getActiveSchedule: () => {
    const { schedules, activeScheduleId } = get();
    return schedules.find((s) => s.id === activeScheduleId);
  },

  fetchSchedules: async () => {
    set({ isLoading: true });
    try {
      const schedules = await api.get<Schedule[]>("/schedules");
      set({ schedules });
      // Auto-select the default schedule if none is active
      if (!get().activeScheduleId && schedules.length > 0) {
        const defaultSchedule = schedules.find((s) => s.isDefault) || schedules[0];
        set({ activeScheduleId: defaultSchedule.id });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load schedules";
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  setActiveSchedule: (id) => set({ activeScheduleId: id }),

  createSchedule: async (data) => {
    try {
      const schedule = await api.post<Schedule>("/schedules", data);
      set({ schedules: [...get().schedules, schedule] });
      toast.success("Schedule created");
      return schedule;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create schedule";
      toast.error(message);
      return undefined;
    }
  },

  deleteSchedule: async (id) => {
    const prev = get().schedules;
    set({ schedules: prev.filter((s) => s.id !== id) });
    try {
      await api.delete(`/schedules/${id}`);
      toast.success("Schedule deleted");
      // Reset active schedule if it was deleted
      if (get().activeScheduleId === id) {
        const remaining = get().schedules;
        set({
          activeScheduleId: remaining.length > 0 ? remaining[0].id : null,
        });
      }
    } catch (err) {
      set({ schedules: prev });
      const message =
        err instanceof Error ? err.message : "Failed to delete schedule";
      toast.error(message);
    }
  },

  addRule: async (data) => {
    try {
      const rule = await api.post<Availability>("/availability", data);
      // Add rule to the matching schedule
      set({
        schedules: get().schedules.map((s) =>
          s.id === rule.scheduleId
            ? { ...s, availabilities: [...(s.availabilities || []), rule] }
            : s
        ),
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to add availability rule";
      toast.error(message);
    }
  },

  updateRule: async (id, data) => {
    try {
      const updated = await api.put<Availability>(`/availability/${id}`, data);
      set({
        schedules: get().schedules.map((s) =>
          s.id === updated.scheduleId
            ? {
                ...s,
                availabilities: (s.availabilities || []).map((a) =>
                  a.id === id ? { ...a, ...updated } : a
                ),
              }
            : s
        ),
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update availability rule";
      toast.error(message);
    }
  },

  deleteRule: async (id) => {
    // Optimistic: remove rule from its schedule
    const prevSchedules = get().schedules;
    set({
      schedules: prevSchedules.map((s) => ({
        ...s,
        availabilities: (s.availabilities || []).filter((a) => a.id !== id),
      })),
    });
    try {
      await api.delete(`/availability/${id}`);
    } catch (err) {
      set({ schedules: prevSchedules });
      const message =
        err instanceof Error ? err.message : "Failed to delete rule";
      toast.error(message);
    }
  },

  addOverride: async (data) => {
    try {
      const override = await api.post<AvailabilityOverride>(
        "/availability/override",
        data
      );
      set({
        schedules: get().schedules.map((s) =>
          s.id === override.scheduleId
            ? { ...s, overrides: [...(s.overrides || []), override] }
            : s
        ),
      });
      toast.success("Date override added");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to add override";
      toast.error(message);
    }
  },

  deleteOverride: async (id) => {
    const prevSchedules = get().schedules;
    set({
      schedules: prevSchedules.map((s) => ({
        ...s,
        overrides: (s.overrides || []).filter((o) => o.id !== id),
      })),
    });
    try {
      await api.delete(`/availability/override/${id}`);
    } catch {
      set({ schedules: prevSchedules });
      toast.error("Failed to delete override");
    }
  },
}));
