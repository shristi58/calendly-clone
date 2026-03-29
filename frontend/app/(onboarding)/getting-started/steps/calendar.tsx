"use client";

import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, CheckCircle2 } from "lucide-react";

export function CalendarStep({ nextStep }: { nextStep: () => void }) {
  const user = useAuthStore((s) => s.user);
  // In a real app we would check if they have OauthAccount connected
  const isConnected = false; 

  const handleConnect = (provider: "google" | "microsoft") => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className="flex flex-col animate-calendly-fade-in">
      <h1 className="text-2xl font-bold text-foreground mb-4">
        Your calendar is connected!
      </h1>
      <p className="text-muted-foreground mb-8">
        Here is how Calendly will work with {user?.email}
      </p>

      <div className="pt-6 border-t border-border space-y-6">
        <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-muted/30">
          <div className="mt-1">
            <CheckCircle2 className="size-6 text-green-500" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              We will check &quot;{user?.email}&quot; for conflicts
            </h3>
            <p className="text-sm text-muted-foreground mt-1 text-balance">
              We&apos;ll only show times when you&apos;re truly available.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-muted/30">
          <div className="mt-1">
            <CheckCircle2 className="size-6 text-green-500" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              We will add events to &quot;{user?.email}&quot;
            </h3>
            <p className="text-sm text-muted-foreground mt-1 text-balance">
              When someone books a meeting, it will instantly appear on your calendar.
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={nextStep}
            className="text-muted-foreground hover:text-foreground"
          >
            Continue without calendar
          </Button>

          <Button
            onClick={nextStep}
            className="h-12 w-full sm:w-auto px-8 text-base font-semibold rounded-[8px] calendly-btn-hover"
          >
            Continue
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
