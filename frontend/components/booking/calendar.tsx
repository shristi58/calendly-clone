"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isBefore,
  startOfDay,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookingCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  availableDates?: string[]; // "YYYY-MM-DD" strings
}

export function BookingCalendar({
  selectedDate,
  onDateSelect,
  availableDates,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfDay(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = useMemo(
    () => eachDayOfInterval({ start: calendarStart, end: calendarEnd }),
    [calendarStart, calendarEnd]
  );

  const isDateAvailable = (date: Date) => {
    if (isBefore(date, today)) return false;
    if (!availableDates) return !isBefore(date, today);
    return availableDates.includes(format(date, "yyyy-MM-dd"));
  };

  const WEEKDAY_HEADERS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  return (
    <div className="flex flex-col gap-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="size-8 p-0"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            disabled={isSameMonth(currentMonth, today)}
            id="calendar-prev-month"
            aria-label="Previous month"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="size-8 p-0"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            id="calendar-next-month"
            aria-label="Next month"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0">
        {WEEKDAY_HEADERS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar cells */}
        {calendarDays.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isAvailable = isDateAvailable(day);
          const isToday = isSameDay(day, today);

          return (
            <button
              key={day.toISOString()}
              onClick={() => isAvailable && onDateSelect(day)}
              disabled={!isAvailable || !isCurrentMonth}
              className={cn(
                "relative flex items-center justify-center size-10 mx-auto rounded-full text-sm transition-colors duration-100",
                !isCurrentMonth && "invisible",
                isCurrentMonth && !isAvailable && "text-muted-foreground/40 cursor-not-allowed",
                isCurrentMonth && isAvailable && !isSelected && "text-foreground font-semibold hover:bg-primary/10 cursor-pointer",
                isSelected && "bg-primary text-primary-foreground font-semibold",
                isToday && !isSelected && "ring-1 ring-primary/30"
              )}
              id={`calendar-day-${format(day, "yyyy-MM-dd")}`}
              aria-label={format(day, "EEEE, MMMM d")}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
