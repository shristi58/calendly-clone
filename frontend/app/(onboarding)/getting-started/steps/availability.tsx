"use client";

import { OnboardingPayload } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DAYS = [
  { label: "Sundays", value: 0 },
  { label: "Mondays", value: 1 },
  { label: "Tuesdays", value: 2 },
  { label: "Wednesdays", value: 3 },
  { label: "Thursdays", value: 4 },
  { label: "Fridays", value: 5 },
  { label: "Saturdays", value: 6 },
];

const HOURS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const min = i % 2 === 0 ? "00" : "30";
  const str = `${hour.toString().padStart(2, "0")}:${min}`;
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const ampm = hour < 12 ? "am" : "pm";
  return { value: str, label: `${displayHour}:${min}${ampm}` };
});

export function AvailabilityStep({
  formData,
  onUpdateField,
  nextStep,
  prevStep,
}: {
  formData: Partial<OnboardingPayload>;
  onUpdateField: (k: keyof OnboardingPayload, v: any) => void;
  nextStep: () => void;
  prevStep: () => void;
}) {
  const selectedDays = formData.availabilities?.map((a) => a.dayOfWeek) || [];
  
  // Pick the first one to serve as the global 'default' start/end they are setting
  const globalStart = formData.availabilities?.[0]?.startTime || "09:00";
  const globalEnd = formData.availabilities?.[0]?.endTime || "17:00";

  const handleDayChange = (dayVal: number, checked: boolean) => {
    let newAvails = [...(formData.availabilities || [])];
    if (checked) {
      if (!selectedDays.includes(dayVal)) {
        newAvails.push({ dayOfWeek: dayVal, startTime: globalStart, endTime: globalEnd });
      }
    } else {
      newAvails = newAvails.filter(a => a.dayOfWeek !== dayVal);
    }
    // Sort logic to keep days ordered visually when sending
    newAvails.sort((a, b) => a.dayOfWeek - b.dayOfWeek);
    onUpdateField("availabilities", newAvails);
  };

  const setGlobalTime = (type: "start" | "end", val: string) => {
    const newAvails = formData.availabilities?.map(a => ({
      ...a,
      ...(type === "start" ? { startTime: val } : { endTime: val })
    })) || [];
    onUpdateField("availabilities", newAvails);
  };

  return (
    <div className="flex flex-col animate-calendly-fade-in">
      <h1 className="text-2xl font-bold text-foreground mb-4">
        Set your availability
      </h1>
      <p className="text-muted-foreground mb-8 text-balance">
        Let Calendly know when you&apos;re typically available to accept meetings.
      </p>

      <div className="pt-6 border-t border-border space-y-8">
        <div>
          <Label className="text-sm font-semibold text-foreground mb-4 block">
            Available hours
          </Label>
          <div className="flex items-center gap-4">
            <Select value={globalStart} onValueChange={v => setGlobalTime("start", v)}>
              <SelectTrigger className="w-[140px] h-11 border-border bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HOURS.map(h => (
                  <SelectItem key={h.value} value={h.value}>{h.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-muted-foreground">to</span>
            <Select value={globalEnd} onValueChange={v => setGlobalTime("end", v)}>
              <SelectTrigger className="w-[140px] h-11 border-border bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HOURS.map(h => (
                  <SelectItem key={h.value} value={h.value}>{h.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold text-foreground mb-4 block">
            Available days
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {DAYS.map((day) => (
              <div
                key={day.value}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                  selectedDays.includes(day.value) ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <Checkbox
                  id={`day-${day.value}`}
                  className="rounded"
                  checked={selectedDays.includes(day.value)}
                  onCheckedChange={(c) => handleDayChange(day.value, !!c)}
                />
                <label
                  htmlFor={`day-${day.value}`}
                  className="text-sm font-medium leading-none cursor-pointer select-none text-foreground flex-1"
                >
                  {day.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground italic">
          Don&apos;t worry! You&apos;ll be able to further customize your availability later.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={prevStep}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>

          <Button
            onClick={nextStep}
            className="h-12 w-full sm:w-auto px-8 text-base font-semibold rounded-[8px] calendly-btn-hover"
            disabled={selectedDays.length === 0}
          >
            Continue
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
