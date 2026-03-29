"use client";

import { OnboardingPayload } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Video, Phone, MapPin, Monitor } from "lucide-react";

export function LocationStep({
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
  const locations = [
    { id: "google_meet", title: "Google Meet", icon: <Video className="size-5" /> },
    { id: "microsoft_teams", title: "Microsoft Teams", icon: <Monitor className="size-5" /> },
    { id: "zoom", title: "Zoom", icon: <Video className="size-5" /> },
    { id: "phone", title: "Phone call", icon: <Phone className="size-5" /> },
    { id: "in_person", title: "In-person meeting", icon: <MapPin className="size-5" /> },
  ];

  return (
    <div className="flex flex-col animate-calendly-fade-in">
      <h1 className="text-2xl font-bold text-foreground mb-4">
        Where will your meetings be held?
      </h1>
      <p className="text-muted-foreground mb-8 text-balance">
        We&apos;ll use this as the default location for your first event type. You can change this later.
      </p>

      <div className="pt-6 border-t border-border space-y-4">
        {locations.map((loc) => (
          <button
            key={loc.id}
            onClick={() => onUpdateField("location", loc.id)}
            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
              formData.location === loc.id
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-background hover:bg-muted/50 hover:border-border/80"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center justify-center size-10 rounded-full ${
                  formData.location === loc.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {loc.icon}
              </div>
              <span className="font-medium text-foreground text-left">{loc.title}</span>
            </div>
            
            <div className={`size-5 rounded-full border-2 flex items-center justify-center ${
              formData.location === loc.id ? "border-primary" : "border-muted-foreground"
            }`}>
              {formData.location === loc.id && <div className="size-2.5 bg-primary rounded-full" />}
            </div>
          </button>
        ))}

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
            disabled={!formData.location}
          >
            Continue
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
