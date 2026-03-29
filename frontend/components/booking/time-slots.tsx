"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface TimeSlotsProps {
  date: Date;
  slots: string[]; // Array of time strings like "5:30pm"
  onSlotSelect: (slot: string) => void;
  timezone: string;
}

export function TimeSlots({ date, slots, onSlotSelect, timezone }: TimeSlotsProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const handleSlotClick = (slot: string) => {
    if (selectedSlot === slot) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot(slot);
    }
  };

  return (
    <div className="flex flex-col gap-3" style={{ animationDelay: "50ms" }}>
      {/* Date heading */}
      <h3 className="text-[15px] font-bold text-[#1A1A1A] tracking-tight">
        {format(date, "EEEE, MMMM d")}
      </h3>

      {/* Slots list */}
      <ScrollArea className="max-h-[440px]">
        <div className="flex flex-col gap-[8px] pr-3">
          {slots.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="size-12 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <p className="text-[13px] text-[#666666] font-medium">
                No available times
              </p>
              <p className="text-[12px] text-[#999999] mt-1">
                Try selecting another date
              </p>
            </div>
          ) : (
            slots.map((slot) => {
              const isSelected = selectedSlot === slot;

              return (
                <div
                  key={slot}
                  className="relative overflow-hidden"
                  style={{ minHeight: "52px" }}
                >
                  {isSelected ? (
                    /* Selected state — Calendly-style split with slide animation */
                    <div className="flex gap-[6px] h-[52px]" style={{ animation: "calendlySlotExpand 200ms ease-out" }}>
                      <button
                        className="flex-1 h-full rounded-[6px] text-[14px] font-bold bg-[#333333] text-white flex items-center justify-center border-0 transition-colors hover:bg-[#444444]"
                        onClick={() => setSelectedSlot(null)}
                        id={`slot-selected-${slot}`}
                      >
                        {slot}
                      </button>
                      <button
                        className="w-[90px] h-full rounded-[6px] text-[14px] font-bold bg-[#006BFF] text-white flex items-center justify-center transition-colors hover:bg-[#005AE0] shadow-sm"
                        onClick={() => onSlotSelect(slot)}
                        id={`slot-next-${slot}`}
                        style={{ animation: "calendlyConfirmSlide 250ms ease-out" }}
                      >
                        Next
                      </button>
                    </div>
                  ) : (
                    /* Default state — outlined button */
                    <button
                      className={cn(
                        "w-full h-[52px] rounded-[6px] text-[14px] font-bold",
                        "border-[1.5px] border-[#006BFF] text-[#006BFF]",
                        "hover:bg-[#E8F0FE] hover:border-[#005AE0]",
                        "transition-all duration-150",
                        "flex items-center justify-center"
                      )}
                      onClick={() => handleSlotClick(slot)}
                      id={`slot-${slot}`}
                    >
                      {slot}
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Inline keyframes for slot animations */}
      <style jsx>{`
        @keyframes calendlySlotExpand {
          from { opacity: 0.8; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes calendlyConfirmSlide {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
