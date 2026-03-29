"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
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
  isToday as checkIsToday,
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
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const calendarDays = useMemo(
    () => eachDayOfInterval({ start: calendarStart, end: calendarEnd }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [calendarStart.toISOString(), calendarEnd.toISOString()]
  );

  const isDateAvailable = (date: Date) => {
    if (isBefore(date, today)) return false;
    if (!availableDates) return true;
    return availableDates.includes(format(date, "yyyy-MM-dd"));
  };

  const isPrevDisabled = isSameMonth(currentMonth, today);

  const WEEKDAY_HEADERS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <div className="flex flex-col">
      {/* Month navigation — Calendly uses bold month name + year with minimal arrows */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[16px] font-bold text-[#1A1A1A] tracking-tight">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-0.5">
          <button
            className={cn(
              "size-8 rounded-full flex items-center justify-center transition-colors",
              isPrevDisabled
                ? "text-[#D4D4D4] cursor-not-allowed"
                : "text-[#1A1A1A] hover:bg-[#F2F2F2]"
            )}
            onClick={() => !isPrevDisabled && setCurrentMonth(subMonths(currentMonth, 1))}
            disabled={isPrevDisabled}
            id="calendar-prev-month"
            aria-label="Previous month"
          >
            <ChevronLeft className="size-5" strokeWidth={2} />
          </button>
          <button
            className="size-8 rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#F2F2F2] transition-colors"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            id="calendar-next-month"
            aria-label="Next month"
          >
            <ChevronRight className="size-5" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAY_HEADERS.map((day) => (
          <div
            key={day}
            className="text-center text-[11px] font-semibold text-[#8C8C8C] tracking-wider py-1.5"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isAvailable = isDateAvailable(day);
          const isToday = checkIsToday(day);

          return (
            <div key={day.toISOString()} className="flex items-center justify-center py-[3px]">
              <button
                onClick={() => isAvailable && isCurrentMonth && onDateSelect(day)}
                disabled={!isAvailable || !isCurrentMonth}
                className={cn(
                  "relative size-[42px] rounded-full text-[14px] font-medium transition-all duration-150 flex items-center justify-center",
                  // Hidden if not current month
                  !isCurrentMonth && "invisible",
                  // Disabled past days
                  isCurrentMonth && !isAvailable &&
                    "text-[#CCCCCC] cursor-not-allowed",
                  // Available but not selected
                  isCurrentMonth && isAvailable && !isSelected &&
                    "text-[#1A1A1A] font-bold hover:bg-[#006BFF]/10 hover:text-[#006BFF] cursor-pointer",
                  // Selected
                  isSelected &&
                    "bg-[#006BFF] text-white font-bold shadow-sm",
                  // Today indicator (subtle dot underneath)
                  isToday && !isSelected &&
                    "text-[#006BFF] font-bold"
                )}
                id={`calendar-day-${format(day, "yyyy-MM-dd")}`}
                aria-label={format(day, "EEEE, MMMM d")}
              >
                {format(day, "d")}
                {/* Today dot */}
                {isToday && (
                  <span
                    className={cn(
                      "absolute bottom-[5px] left-1/2 -translate-x-1/2 size-[4px] rounded-full",
                      isSelected ? "bg-white" : "bg-[#006BFF]"
                    )}
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
