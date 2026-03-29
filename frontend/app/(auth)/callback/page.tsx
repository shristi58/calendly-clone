"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Loader2 } from "lucide-react";

function CallbackContent() {
  const router = useRouter();
  const fetchMe = useAuthStore((s) => s.fetchMe);

  useEffect(() => {
    // Backend has already set secure httpOnly cookies during the OAuth redirect.
    // We just need to fetch the user and redirect.
    fetchMe().then((user) => {
      if (user && !user.isOnboarded) {
        router.replace("/getting-started?step=4");
      } else if (user) {
        router.replace("/app/scheduling/meeting_types/user/me");
      } else {
        router.replace("/login");
      }
    });
  }, [router, fetchMe]);

  return (
    <div className="flex flex-col items-center gap-3 animate-calendly-fade-in">
      <Loader2 className="size-8 text-primary animate-spin" />
      <p className="text-sm text-muted-foreground">Signing you in...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="size-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        }
      >
        <CallbackContent />
      </Suspense>
    </div>
  );
}
