"use client";

import { cn } from "@/lib/utils";
import { Clock, Video, ArrowLeft, CalendarDays, Globe } from "lucide-react";
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
        "w-full lg:w-[320px] shrink-0 p-6 lg:p-8 flex flex-col border-r border-[#E5E5E5]",
        className
      )}
    >
      {/* Back button (in step 2) */}
      {step > 1 && onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center justify-center size-9 rounded-full border border-[#D9D9D9] hover:bg-[#F5F5F5] transition-colors mb-6"
          id="booking-back"
          aria-label="Go back"
        >
          <ArrowLeft className="size-4 text-[#666666]" />
        </button>
      )}

      {/* Host name */}
      <p className="text-[14px] font-semibold text-[#666666] mb-1">
        {hostName}
      </p>

      {/* Event name */}
      <h1 className="text-[22px] font-bold text-[#1A1A1A] tracking-tight leading-tight mb-5">
        {event.name}
      </h1>

      {/* Meta fields */}
      <div className="flex flex-col gap-3">
        {/* Duration */}
        <div className="flex items-center gap-2.5">
          <Clock className="size-[18px] text-[#8C8C8C] shrink-0" strokeWidth={2} />
          <span className="text-[14px] text-[#4D4D4D] font-medium">{event.duration} min</span>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2.5">
          <Video className="size-[18px] text-[#8C8C8C] shrink-0 mt-0.5" strokeWidth={2} />
          <span className="text-[14px] text-[#4D4D4D]">
            Web conferencing details provided upon confirmation.
          </span>
        </div>

        {/* Show selected date/time in step 2 */}
        {step >= 2 && selectedDate && selectedTime && (
          <div className="flex items-start gap-2.5">
            <CalendarDays className="size-[18px] text-[#8C8C8C] shrink-0 mt-0.5" strokeWidth={2} />
            <div className="flex flex-col">
              <span className="text-[14px] text-[#4D4D4D] font-semibold">
                {selectedTime} – {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </span>
            </div>
          </div>
        )}

        {/* Timezone */}
        <div className="flex items-center gap-2.5">
          <Globe className="size-[18px] text-[#8C8C8C] shrink-0" strokeWidth={2} />
          <span className="text-[14px] text-[#4D4D4D]">
            {Intl.DateTimeFormat().resolvedOptions().timeZone}
          </span>
        </div>
      </div>

      {/* Description */}
      {event.description && (
        <>
          <div className="border-t border-[#E5E5E5] my-5" />
          <p className="text-[13px] text-[#666666] leading-relaxed">
            {event.description}
          </p>
        </>
      )}

      {/* Footer */}
      <div className="mt-auto pt-8">
        <div className="flex items-center gap-3 text-[12px] text-[#999999]">
          <button className="hover:text-[#666666] transition-colors" id="booking-cookie-settings">
            Cookie settings
          </button>
          <span>·</span>
          <button className="hover:text-[#666666] transition-colors" id="booking-privacy">
            Report abuse
          </button>
        </div>
      </div>
    </div>
  );
}
