"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export function useAuth({ redirectTo = "/login" }: { redirectTo?: string } = {}) {
  const { user, isLoading, isInitialized, initialize, fetchMe } =
    useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  useEffect(() => {
    // After initialization, if there's no user and we should redirect, do so
    if (isInitialized && !user && !isLoading && redirectTo) {
      router.replace(redirectTo);
    }
  }, [isInitialized, user, isLoading, redirectTo, router]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isInitialized,
    fetchMe,
  };
}
