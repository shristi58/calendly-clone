"use client";

import { useEffect, useState, use } from "react";
import { api } from "@/lib/api";
import { EventForm } from "@/components/dashboard/event-form";
import { FormSkeleton } from "@/components/shared/loading-skeleton";
import type { EventType } from "@/types";

export default function EditEventTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [event, setEvent] = useState<EventType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<EventType>(`/event-types/${id}`);
        setEvent(data);
      } catch {
        // Error is handled by apiClient
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-8 max-w-2xl">
        <FormSkeleton fields={6} />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Event type not found.</p>
      </div>
    );
  }

  return <EventForm event={event} mode="edit" />;
}
