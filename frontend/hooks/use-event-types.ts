"use client";

import { useEffect, useRef } from "react";
import { useEventStore } from "@/stores/event-store";

export function useEventTypes() {
  const { eventTypes, isLoading, fetch } = useEventStore();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetch();
    }
  }, [fetch]);

  return { eventTypes, isLoading };
}
