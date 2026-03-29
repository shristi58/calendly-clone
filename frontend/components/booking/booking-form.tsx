"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bookingSchema, type BookingFormData } from "@/lib/validators";
import { Loader2 } from "lucide-react";
import type { Question } from "@/types";

interface BookingFormProps {
  questions: Question[];
  onSubmit: (data: BookingFormData & { answers: Record<string, string> }) => void;
  isSubmitting: boolean;
}

export function BookingForm({
  questions,
  onSubmit,
  isSubmitting,
}: BookingFormProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const handleFormSubmit = (data: BookingFormData) => {
    onSubmit({ ...data, answers });
  };

  const updateAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-5 animate-calendly-slide-left"
    >
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="booking-name" className="text-sm font-medium">
          Name *
        </Label>
        <Input
          id="booking-name"
          placeholder="John Doe"
          autoFocus
          aria-invalid={!!errors.inviteeName}
          {...register("inviteeName")}
          className="h-11"
        />
        {errors.inviteeName && (
          <p className="text-sm text-destructive">
            {errors.inviteeName.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="booking-email" className="text-sm font-medium">
          Email *
        </Label>
        <Input
          id="booking-email"
          type="email"
          placeholder="you@example.com"
          aria-invalid={!!errors.inviteeEmail}
          {...register("inviteeEmail")}
          className="h-11"
        />
        {errors.inviteeEmail && (
          <p className="text-sm text-destructive">
            {errors.inviteeEmail.message}
          </p>
        )}
      </div>

      {/* Custom questions */}
      {questions
        .sort((a, b) => a.order - b.order)
        .map((q) => (
          <div key={q.id} className="flex flex-col gap-1.5">
            <Label htmlFor={`question-${q.id}`} className="text-sm font-medium">
              {q.question} {q.required && "*"}
            </Label>

            {q.type === "text" && (
              <Input
                id={`question-${q.id}`}
                placeholder="Your answer"
                value={answers[q.id] || ""}
                onChange={(e) => updateAnswer(q.id, e.target.value)}
                required={q.required}
                className="h-11"
              />
            )}

            {q.type === "textarea" && (
              <Textarea
                id={`question-${q.id}`}
                placeholder="Please share anything that will help prepare for our meeting."
                value={answers[q.id] || ""}
                onChange={(e) => updateAnswer(q.id, e.target.value)}
                required={q.required}
                rows={4}
              />
            )}

            {q.type === "dropdown" && q.options && (
              <Select
                value={answers[q.id] || ""}
                onValueChange={(v) => updateAnswer(q.id, v)}
                required={q.required}
              >
                <SelectTrigger id={`question-${q.id}`} className="h-11">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  {q.options.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {q.type === "radio" && q.options && (
              <div className="flex flex-col gap-2">
                {q.options.map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={(e) => updateAnswer(q.id, e.target.value)}
                      required={q.required}
                      className="size-4 accent-primary"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

      {/* Default textarea for additional info */}
      {questions.length === 0 && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="booking-notes" className="text-sm font-medium">
            Please share anything that will help prepare for our meeting.
          </Label>
          <Textarea
            id="booking-notes"
            placeholder="Share any details..."
            value={answers["notes"] || ""}
            onChange={(e) => updateAnswer("notes", e.target.value)}
            rows={4}
          />
        </div>
      )}

      {/* Submit */}
      <Button
        id="booking-submit"
        type="submit"
        disabled={isSubmitting}
        className="h-12 rounded-full text-base font-semibold calendly-btn-hover w-full mt-2"
      >
        {isSubmitting ? (
          <Loader2 className="animate-spin" data-icon="inline-start" />
        ) : null}
        Schedule Event
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By proceeding, you confirm that you have read and agree to{" "}
        <span className="text-primary">Calendly&apos;s Terms of Use</span> and{" "}
        <span className="text-primary">Privacy Notice</span>.
      </p>
    </form>
  );
}
