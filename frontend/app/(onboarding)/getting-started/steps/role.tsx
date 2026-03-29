"use client";

import { OnboardingPayload } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Target, Users, Presentation, Briefcase, GraduationCap, Building2, Paintbrush } from "lucide-react";

const ROLES = [
  { id: "sales", label: "Sales + Marketing", icon: <Target className="size-5" /> },
  { id: "success", label: "Customer Success + Account Management", icon: <Users className="size-5" /> },
  { id: "marketing", label: "Marketing", icon: <Presentation className="size-5" /> },
  { id: "recruitment", label: "Interview scheduling", icon: <Briefcase className="size-5" /> },
  { id: "education", label: "Education", icon: <GraduationCap className="size-5" /> },
  { id: "freelance", label: "Freelance + Consultant", icon: <Building2 className="size-5" /> },
  { id: "design", label: "Design + Product", icon: <Paintbrush className="size-5" /> },
  { id: "other", label: "Other", icon: <div className="size-5 flex items-center justify-center font-bold">...</div> },
];

export function RoleStep({
  formData,
  onUpdateField,
  finalize,
  isLoading,
  prevStep,
}: {
  formData: Partial<OnboardingPayload>;
  onUpdateField: (k: keyof OnboardingPayload, v: any) => void;
  finalize: () => void;
  isLoading: boolean;
  prevStep: () => void;
}) {
  return (
    <div className="flex flex-col animate-calendly-fade-in">
      <h1 className="text-2xl font-bold text-foreground mb-4">
        What is your day-to-day role at work?
      </h1>
      <p className="text-muted-foreground mb-8 text-balance">
        This will help us tailor your Calendly experience to fit your specific needs.
      </p>

      <div className="pt-6 border-t border-border space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => onUpdateField("role", role.id)}
              className={`w-full flex items-center p-4 rounded-xl border-2 transition-all ${
                formData.role === role.id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-background hover:bg-muted/50 hover:border-border/80"
              }`}
            >
              <div
                className={`flex items-center justify-center size-8 rounded mr-4 ${
                  formData.role === role.id ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {role.icon}
              </div>
              <span className={`font-medium text-left text-sm ${
                formData.role === role.id ? "text-primary font-semibold" : "text-foreground"
              }`}>
                {role.label}
              </span>
            </button>
          ))}
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={prevStep}
            className="text-muted-foreground hover:text-foreground"
            disabled={isLoading}
          >
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>

          <Button
            onClick={finalize}
            disabled={!formData.role || isLoading}
            className="h-12 w-full sm:w-auto px-8 text-base font-semibold rounded-[8px] calendly-btn-hover"
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
            Finish
          </Button>
        </div>
      </div>
    </div>
  );
}
