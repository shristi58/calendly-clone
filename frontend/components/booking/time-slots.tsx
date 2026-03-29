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
    <div className="animate-calendly-slide-left flex flex-col gap-4">
      {/* Date heading */}
      <h3 className="text-base font-semibold text-foreground">
        {format(date, "EEEE, MMMM d")}
      </h3>

      {/* Slots list */}
      <ScrollArea className="max-h-[440px]">
        <div className="flex flex-col gap-2 pr-4">
          {slots.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No available times for this date.
            </p>
          ) : (
            slots.map((slot) => {
              const isSelected = selectedSlot === slot;

              return (
                <div key={slot} className="relative">
                  {isSelected ? (
                    /* Selected state — split button */
                    <div className="flex gap-2 animate-calendly-scale-in">
                      <Button
                        variant="secondary"
                        className="flex-1 h-[52px] rounded-lg text-sm font-semibold bg-gray-800 text-white hover:bg-gray-700 border-0"
                        id={`slot-selected-${slot}`}
                      >
                        {slot}
                      </Button>
                      <Button
                        className="w-24 h-[52px] rounded-lg text-sm font-semibold calendly-btn-hover"
                        onClick={() => onSlotSelect(slot)}
                        id={`slot-next-${slot}`}
                      >
                        Next
                      </Button>
                    </div>
                  ) : (
                    /* Default state — outlined button */
                    <Button
                      variant="outline"
                      className="w-full h-[52px] rounded-lg text-sm font-semibold border-primary text-primary hover:bg-primary/5 transition-colors duration-100"
                      onClick={() => handleSlotClick(slot)}
                      id={`slot-${slot}`}
                    >
                      {slot}
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
