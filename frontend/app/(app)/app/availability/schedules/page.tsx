"use client";

import { useState, useEffect, useMemo } from "react";
import { useAvailabilityStore } from "@/stores/availability-store";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Info,
  Plus,
  ChevronDown,
  Loader2,
  Copy,
  X,
  AlertTriangle,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import type { Schedule, Availability } from "@/types";

const DAYS = [
  { label: "SUN", short: "S", value: 0 },
  { label: "MON", short: "M", value: 1 },
  { label: "TUE", short: "T", value: 2 },
  { label: "WED", short: "W", value: 3 },
  { label: "THU", short: "T", value: 4 },
  { label: "FRI", short: "F", value: 5 },
  { label: "SAT", short: "S", value: 6 },
];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? "00" : "30";
  const h12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const ampm = hours < 12 ? "am" : "pm";
  return {
    value: `${String(hours).padStart(2, "0")}:${minutes}`,
    label: `${h12}:${minutes}${ampm}`,
  };
});

const TIMEZONES = typeof Intl !== "undefined" ? Intl.supportedValuesOf("timeZone") : ["UTC", "America/New_York", "Europe/London", "Asia/Kolkata"];

export default function AvailabilityPage() {
  const {
    schedules,
    activeScheduleId,
    isLoading,
    fetchSchedules,
    setActiveSchedule,
    createSchedule,
    addRule,
    updateRule,
    deleteRule,
  } = useAvailabilityStore();

  const { user, updateProfile } = useAuthStore();

  const [activeTab, setActiveTab] = useState("Schedules");

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const activeSchedule = useMemo(
    () => schedules.find((s) => s.id === activeScheduleId),
    [schedules, activeScheduleId]
  );

  const availabilitiesByDay = useMemo(() => {
    if (!activeSchedule?.availabilities) return {};
    const grouped: Record<number, Availability[]> = {};
    for (const a of activeSchedule.availabilities) {
      if (!grouped[a.dayOfWeek]) grouped[a.dayOfWeek] = [];
      grouped[a.dayOfWeek].push(a);
    }
    return grouped;
  }, [activeSchedule]);

  const handleAddRule = async (dayOfWeek: number) => {
    if (!activeScheduleId) return;
    await addRule({
      scheduleId: activeScheduleId,
      dayOfWeek,
      startTime: "09:00",
      endTime: "17:00",
    });
  };

  const handleCopyDay = async (fromDay: number) => {
    if (!activeScheduleId) return;
    const rules = availabilitiesByDay[fromDay] || [];
    if (rules.length === 0) {
      toast.error("No hours to copy");
      return;
    }
    // Copy to all other weekdays
    for (const day of [1, 2, 3, 4, 5]) {
      if (day === fromDay) continue;
      for (const rule of rules) {
        await addRule({
          scheduleId: activeScheduleId,
          dayOfWeek: day,
          startTime: rule.startTime,
          endTime: rule.endTime,
        });
      }
    }
    toast.success("Hours copied to weekdays");
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const ampm = hour < 12 ? "am" : "pm";
    return `${h12}:${m}${ampm}`;
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-[900px]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <h1 className="text-[20px] font-bold text-[#1A1A1A]">Availability</h1>
        <button className="text-[#666666] hover:text-[#1A1A1A] transition-colors">
          <Info className="size-[18px]" strokeWidth={2} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[#D9D9D9] text-[14px] font-medium">
        {["Schedules", "Calendar settings", "Advanced settings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 relative transition-colors ${
              activeTab === tab
                ? "text-[#006BFF]"
                : "text-[#666666] hover:text-[#1A1A1A]"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#006BFF]" />
            )}
          </button>
        ))}
      </div>

      {activeTab === "Schedules" && (
        <>
          {/* Schedule Selector Card */}
          <div className="border border-[#E5E5E5] rounded-xl bg-white shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-[12px] text-[#666666] font-medium uppercase tracking-wider mb-1">
                    Schedule
                  </p>
                  <Select
                    value={activeScheduleId || ""}
                    onValueChange={(v) => setActiveSchedule(v)}
                  >
                    <SelectTrigger className="w-[260px] border-0 p-0 h-auto text-[16px] font-bold text-[#1A1A1A] shadow-none focus:ring-0">
                      <SelectValue placeholder="Select schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      {schedules.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name} {s.isDefault ? "(default)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs rounded-full border-[#CCCCCC]"
                  onClick={async () => {
                    const name = prompt("Schedule name:");
                    if (name) {
                      const s = await createSchedule({ name });
                      if (s) setActiveSchedule(s.id);
                    }
                  }}
                >
                  <Plus className="size-3 mr-1" />
                  New schedule
                </Button>
              </div>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="size-8 animate-spin text-[#006BFF]" />
              </div>
            )}

            {/* Weekly Hours */}
            {!isLoading && activeSchedule && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[14px] font-semibold text-[#1A1A1A]">
                    Set your weekly hours
                  </h3>
                  
                  {/* Timezone Selector */}
                  <div className="flex items-center gap-2">
                    <Globe className="size-4 text-[#666666]" />
                    <Select
                      value={user?.timezone || "UTC"}
                      onValueChange={(v) => updateProfile({ timezone: v })}
                    >
                      <SelectTrigger className="border-0 bg-transparent hover:bg-[#F2F2F2] px-2 h-8 shadow-none focus:ring-0 text-[13px] text-[#1A1A1A] font-medium w-fit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align="end" className="max-h-[300px]">
                        {TIMEZONES.map((tz) => (
                          <SelectItem key={tz} value={tz}>
                            {tz.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col divide-y divide-[#EBEBEB]">
                  {DAYS.map((day) => {
                    const rules = availabilitiesByDay[day.value] || [];
                    const hasRules = rules.length > 0;

                    return (
                      <div
                        key={day.value}
                        className="flex items-start gap-4 py-4"
                      >
                        {/* Day badge */}
                        <div className="flex items-center gap-3 min-w-[60px] pt-1">
                          <div
                            className={`size-8 rounded-full flex items-center justify-center text-[12px] font-bold ${
                              hasRules
                                ? "bg-[#006BFF] text-white"
                                : "bg-[#EBEBEB] text-[#666666]"
                            }`}
                          >
                            {day.short}
                          </div>
                          <span className="text-[13px] font-semibold text-[#1A1A1A]">
                            {day.label}
                          </span>
                        </div>

                        {/* Time rules */}
                        <div className="flex-1 flex flex-col gap-2">
                          {hasRules ? (
                            rules.map((rule) => (
                              <div
                                key={rule.id}
                                className="flex items-center gap-2"
                              >
                                <Select
                                  value={rule.startTime}
                                  onValueChange={(v) => updateRule(rule.id, { startTime: v })}
                                >
                                  <SelectTrigger className="w-[105px] h-10 bg-[#F2F2F2] border-0 outline-none shadow-none focus-visible:ring-2 focus-visible:ring-[#006BFF] hover:bg-[#EBEBEB] transition-colors rounded text-[#1A1A1A] font-medium">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-[250px]">
                                    {TIME_OPTIONS.map((t) => (
                                      <SelectItem key={t.value} value={t.value}>
                                        {t.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <span className="text-[#666666] px-1">–</span>

                                <Select
                                  value={rule.endTime}
                                  onValueChange={(v) => updateRule(rule.id, { endTime: v })}
                                >
                                  <SelectTrigger className="w-[105px] h-10 bg-[#F2F2F2] border-0 outline-none shadow-none focus-visible:ring-2 focus-visible:ring-[#006BFF] hover:bg-[#EBEBEB] transition-colors rounded text-[#1A1A1A] font-medium">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-[250px]">
                                    {TIME_OPTIONS.map((t) => (
                                      <SelectItem key={t.value} value={t.value}>
                                        {t.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <button
                                  onClick={() => deleteRule(rule.id)}
                                  className="ml-2 p-1 text-[#999999] hover:text-destructive transition-colors rounded-full hover:bg-red-50"
                                >
                                  <X className="size-3.5" />
                                </button>
                              </div>
                            ))
                          ) : (
                            <span className="text-[13px] text-[#999999] italic pt-1">
                              Unavailable
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 pt-1">
                          <button
                            onClick={() => handleAddRule(day.value)}
                            className="p-1.5 text-[#666666] hover:text-[#006BFF] hover:bg-blue-50 rounded-full transition-colors"
                            title="Add hours"
                          >
                            <Plus className="size-4" />
                          </button>
                          {hasRules && (
                            <button
                              onClick={() => handleCopyDay(day.value)}
                              className="p-1.5 text-[#666666] hover:text-[#006BFF] hover:bg-blue-50 rounded-full transition-colors"
                              title="Copy to weekdays"
                            >
                              <Copy className="size-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No schedule selected */}
            {!isLoading && !activeSchedule && schedules.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <AlertTriangle className="size-10 text-[#D9D9D9] mb-4" />
                <h3 className="text-[18px] font-bold text-[#1A1A1A] mb-2">
                  No schedules yet
                </h3>
                <p className="text-[14px] text-[#666666] mb-6 max-w-[360px]">
                  Create a schedule to define when you&apos;re available for meetings.
                </p>
                <Button
                  onClick={async () => {
                    const s = await createSchedule({
                      name: "Working Hours",
                      isDefault: true,
                    });
                    if (s) setActiveSchedule(s.id);
                  }}
                  className="h-[44px] rounded-full bg-[#006BFF] hover:bg-[#005AE0] px-6 text-[14px] font-semibold"
                >
                  <Plus className="size-4 mr-2" />
                  Create schedule
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Placeholder for other tabs */}
      {activeTab !== "Schedules" && (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-[#E5E5E5] rounded-xl bg-white shadow-sm">
          <Info className="size-10 text-[#D9D9D9] mb-4" />
          <h3 className="text-[18px] font-bold text-[#1A1A1A] mb-2">
            {activeTab}
          </h3>
          <p className="text-[14px] text-[#666666]">
            This feature is coming soon.
          </p>
        </div>
      )}
    </div>
  );
}
