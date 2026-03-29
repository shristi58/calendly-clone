"use client";

import { useMemo } from "react";
import { OnboardingPayload } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Globe, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function WelcomeStep({
  formData,
  onUpdateField,
  nextStep,
}: {
  formData: Partial<OnboardingPayload>;
  onUpdateField: (k: keyof OnboardingPayload, v: any) => void;
  nextStep: () => void;
}) {
  const timezones = useMemo(() => {
    try {
      // Return a standard list or just standard Intl.supportedValuesOf('timeZone')
      // For fallback we can import a list
      // Let's just use Intl
      if (typeof Intl !== 'undefined' && (Intl as any).supportedValuesOf) {
        return (Intl as any).supportedValuesOf('timeZone');
      }
      return [Intl.DateTimeFormat().resolvedOptions().timeZone];
    } catch {
      return ["UTC"];
    }
  }, []);

  return (
    <div className="flex flex-col animate-calendly-fade-in">
      <h1 className="text-2xl font-bold text-foreground mb-4">
        Welcome to Calendly
      </h1>
      <p className="text-muted-foreground mb-8">
        We take the work out of connecting with others so you can accomplish more.
      </p>

      <div className="pt-6 border-t border-border">
        <div className="flex flex-col gap-2 mb-8">
          <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Globe className="size-4 text-muted-foreground" />
            Timezone
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            Confirm your timezone to make sure you&apos;re booked during the right hours.
          </p>
          
          <Select
            value={formData.timezone}
            onValueChange={(val) => onUpdateField("timezone", val)}
          >
            <SelectTrigger className="h-12 w-full max-w-sm rounded-[8px] bg-background">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((tz: string) => (
                <SelectItem key={tz} value={tz}>
                  {tz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={nextStep}
          className="h-12 px-8 text-base font-semibold rounded-[8px] calendly-btn-hover"
        >
          Continue
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
