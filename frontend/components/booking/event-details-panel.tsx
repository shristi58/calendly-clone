"use client";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Clock, Video, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import type { EventType } from "@/types";

interface EventDetailsPanelProps {
  event: EventType;
  selectedDate?: Date | null;
  selectedTime?: string | null;
  step: number;
  onBack?: () => void;
  className?: string;
}

export function EventDetailsPanel({
  event,
  selectedDate,
  selectedTime,
  step,
  onBack,
  className,
}: EventDetailsPanelProps) {
  const hostName = event.user?.name || "Host";

  return (
    <div
      className={cn(
        "w-full lg:w-[320px] shrink-0 p-6 lg:p-8 flex flex-col",
        className
      )}
    >
      {/* Back button (in step 2) */}
      {step > 1 && onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mb-4 font-medium"
          id="booking-back"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
      )}

      {/* Host avatar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-semibold text-primary">
            {hostName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </span>
        </div>
        <span className="text-sm text-muted-foreground font-medium">
          {hostName}
        </span>
      </div>

      {/* Event name */}
      <h1 className="text-xl font-bold text-foreground tracking-tight mb-4">
        {event.name}
      </h1>

      {/* Meta fields */}
      <div className="flex flex-col gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="size-4 shrink-0" />
          <span>{event.duration} min</span>
        </div>

        <div className="flex items-start gap-2">
          <Video className="size-4 shrink-0 mt-0.5" />
          <span>Web conferencing details provided upon confirmation.</span>
        </div>

        {/* Show selected date/time in step 2 */}
        {step >= 2 && selectedDate && selectedTime && (
          <div className="flex items-center gap-2 text-foreground font-medium mt-1">
            <span>
              {format(selectedDate, "h:mma")} – {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      {event.description && (
        <>
          <Separator className="my-4" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {event.description}
          </p>
        </>
      )}

      {/* Footer */}
      <div className="mt-auto pt-8">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <button className="hover:underline" id="booking-cookie-settings">
            Cookie settings
          </button>
          <span>·</span>
          <button className="hover:underline" id="booking-privacy">
            Report abuse
          </button>
        </div>
      </div>
    </div>
  );
}
