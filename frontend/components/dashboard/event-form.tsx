"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEventStore } from "@/stores/event-store";
import { useAvailabilityStore } from "@/stores/availability-store";
import { eventTypeSchema, type EventTypeFormData } from "@/lib/validators";
import { Loader2 } from "lucide-react";
import type { EventType } from "@/types";

const DURATIONS = [15, 30, 45, 60];
const COLORS = [
  "#006BFF",
  "#FF6B35",
  "#7C3AED",
  "#059669",
  "#DC2626",
  "#F59E0B",
];

interface EventFormProps {
  event?: EventType;
  mode: "create" | "edit";
  onSuccess?: () => void;
}

export function EventForm({ event, mode, onSuccess }: EventFormProps) {
  const { create, update } = useEventStore();
  const { schedules, fetchSchedules } = useAvailabilityStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedColor, setSelectedColor] = useState(event?.color || COLORS[0]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EventTypeFormData>({
    resolver: zodResolver(eventTypeSchema),
    defaultValues: {
      name: event?.name || "",
      slug: event?.slug || "",
      description: event?.description || "",
      duration: event?.duration || 30,
      color: event?.color || COLORS[0],
      bufferBefore: event?.bufferBefore || 0,
      bufferAfter: event?.bufferAfter || 0,
      scheduleId: event?.scheduleId || "",
    },
  });

  const nameValue = watch("name");

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // Auto-generate slug from name (only in create mode)
  useEffect(() => {
    if (mode === "create" && nameValue) {
      const slug = nameValue
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setValue("slug", slug);
    }
  }, [nameValue, mode, setValue]);

  const onSubmit = async (data: EventTypeFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        color: selectedColor,
        scheduleId: data.scheduleId || undefined,
      };

      if (mode === "create") {
        const created = await create(payload);
        if (created) {
          onSuccess?.();
        }
      } else if (event) {
        await update(event.id, payload);
        onSuccess?.();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 p-2">
      {/* Name */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="event-name">Event name *</Label>
        <Input
          id="event-name"
          placeholder="e.g., 30 Minute Meeting"
          aria-invalid={!!errors.name}
          {...register("name")}
          className="h-11"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Slug */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="event-slug">URL slug *</Label>
        <div className="flex items-center gap-0">
          <span className="text-sm text-muted-foreground bg-muted px-3 py-2.5 rounded-l-lg border border-r-0 border-input">
            calendly.com/you/
          </span>
          <Input
            id="event-slug"
            placeholder="30min-meeting"
            aria-invalid={!!errors.slug}
            {...register("slug")}
            className="h-11 rounded-l-none"
          />
        </div>
        {errors.slug && (
          <p className="text-sm text-destructive">{errors.slug.message}</p>
        )}
      </div>

      {/* Duration */}
      <div className="flex flex-col gap-2">
        <Label>Duration *</Label>
        <div className="flex gap-2">
          {DURATIONS.map((d) => (
            <Button
              key={d}
              type="button"
              variant={watch("duration") === d ? "default" : "outline"}
              className="flex-1 h-10"
              onClick={() => setValue("duration", d)}
              id={`event-duration-${d}`}
            >
              {d} min
            </Button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="event-description">Description</Label>
        <Textarea
          id="event-description"
          placeholder="Add a description for your event..."
          {...register("description")}
          rows={3}
        />
      </div>

      {/* Color */}
      <div className="flex flex-col gap-2">
        <Label>Event color</Label>
        <div className="flex items-center gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`size-8 rounded-full border-2 transition-transform ${
                selectedColor === color
                  ? "border-foreground scale-110"
                  : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => {
                setSelectedColor(color);
                setValue("color", color);
              }}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      </div>

      <Separator />

      {/* Buffer times */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="event-buffer-before">Buffer before (min)</Label>
          <Select
            value={String(watch("bufferBefore") || 0)}
            onValueChange={(v) => setValue("bufferBefore", Number(v))}
          >
            <SelectTrigger id="event-buffer-before" className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0, 5, 10, 15, 30, 60].map((m) => (
                <SelectItem key={m} value={String(m)}>
                  {m} min
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="event-buffer-after">Buffer after (min)</Label>
          <Select
            value={String(watch("bufferAfter") || 0)}
            onValueChange={(v) => setValue("bufferAfter", Number(v))}
          >
            <SelectTrigger id="event-buffer-after" className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[0, 5, 10, 15, 30, 60].map((m) => (
                <SelectItem key={m} value={String(m)}>
                  {m} min
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Schedule */}
      {schedules.length > 0 && (
        <div className="flex flex-col gap-2">
          <Label htmlFor="event-schedule">Schedule</Label>
          <Select
            value={watch("scheduleId") || ""}
            onValueChange={(v) => setValue("scheduleId", v)}
          >
            <SelectTrigger id="event-schedule" className="h-11">
              <SelectValue placeholder="Use default schedule" />
            </SelectTrigger>
            <SelectContent>
              {schedules.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name} {s.isDefault ? "(Default)" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Separator />

      {/* Submit */}
      <div className="flex items-center gap-3">
        <Button
          id="event-form-submit"
          type="submit"
          disabled={isSubmitting}
          className="bg-[#006BFF] hover:bg-[#005AE0]"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin mr-2 size-4" />
          ) : null}
          {mode === "create" ? "Create Event Type" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
