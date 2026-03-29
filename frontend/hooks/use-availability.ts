"use client";

import { useEffect, useRef } from "react";
import { useAvailabilityStore } from "@/stores/availability-store";

export function useAvailability() {
  const store = useAvailabilityStore();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      store.fetchSchedules();
    }
  }, [store.fetchSchedules]);

  return store;
}
