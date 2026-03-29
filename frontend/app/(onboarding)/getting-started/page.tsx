"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Loader2 } from "lucide-react";
import { GettingStartedClient } from "./client";

export default function GettingStartedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const initialize = useAuthStore((s) => s.initialize);
  const [isReady, setIsReady] = useState(false);

  // Trigger initialization on mount — essential for hard navigations
  // where the Zustand store has been reset
  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  useEffect(() => {
    if (isInitialized) {
      if (!user) {
        router.replace("/login");
      } else if (user.isOnboarded) {
        router.replace("/app/scheduling/meeting_types/user/me");
      } else {
        setIsReady(true);
      }
    }
  }, [user, isInitialized, router]);

  if (!isReady || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <Loader2 className="size-8 text-primary animate-spin" />
      </div>
    );
  }

  const initialStep = searchParams.get("step") 
    ? parseInt(searchParams.get("step")!, 10) 
    : 1;

  return <GettingStartedClient user={user} initialStep={initialStep} />;
}
