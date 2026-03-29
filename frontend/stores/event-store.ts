"use client";

import { create } from "zustand";
import { api } from "@/lib/api";
import type {
  EventType,
  CreateEventPayload,
  UpdateEventPayload,
} from "@/types";
import { toast } from "sonner";

interface EventState {
  eventTypes: EventType[];
  isLoading: boolean;

  fetch: () => Promise<void>;
  create: (data: CreateEventPayload) => Promise<EventType | undefined>;
  update: (id: string, data: UpdateEventPayload) => Promise<void>;
  remove: (id: string) => Promise<void>;
  toggleActive: (id: string, isActive: boolean) => Promise<void>;
}

export const useEventStore = create<EventState>((set, get) => ({
  eventTypes: [],
  isLoading: false,

  fetch: async () => {
    set({ isLoading: true });
    try {
      const eventTypes = await api.get<EventType[]>("/event-types");
      set({ eventTypes });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load event types";
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  create: async (data) => {
    try {
      const eventType = await api.post<EventType>("/event-types", data);
      set({ eventTypes: [...get().eventTypes, eventType] });
      toast.success("Event type created!");
      return eventType;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create event type";
      toast.error(message);
      return undefined;
    }
  },

  update: async (id, data) => {
    try {
      const updated = await api.put<EventType>(`/event-types/${id}`, data);
      set({
        eventTypes: get().eventTypes.map((et) =>
          et.id === id ? { ...et, ...updated } : et
        ),
      });
      toast.success("Event type updated!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update event type";
      toast.error(message);
    }
  },

  remove: async (id) => {
    // Optimistic delete
    const prev = get().eventTypes;
    set({ eventTypes: prev.filter((et) => et.id !== id) });
    try {
      await api.delete(`/event-types/${id}`);
      toast.success("Event type deleted");
    } catch (err) {
      // Revert on failure
      set({ eventTypes: prev });
      const message =
        err instanceof Error ? err.message : "Failed to delete event type";
      toast.error(message);
    }
  },

  toggleActive: async (id, isActive) => {
    // Optimistic toggle
    const prev = get().eventTypes;
    set({
      eventTypes: prev.map((et) =>
        et.id === id ? { ...et, isActive } : et
      ),
    });
    try {
      await api.put(`/event-types/${id}`, { isActive });
    } catch {
      // Revert on failure
      set({ eventTypes: prev });
      toast.error("Failed to update event type");
    }
  },
}));
