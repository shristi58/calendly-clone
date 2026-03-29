"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { CalendlyLogo } from "@/components/shared/calendly-logo";

// import the step components
import { WelcomeStep } from "./steps/welcome";
import { CalendarStep } from "./steps/calendar";
import { AvailabilityStep } from "./steps/availability";
import { LocationStep } from "./steps/location";
import { RoleStep } from "./steps/role";
import { OnboardingPayload, User } from "@/types";
import { Progress } from "@/components/ui/progress";

export function GettingStartedClient({ user, initialStep }: { user: User, initialStep: number }) {
  const router = useRouter();
  const fetchMe = useAuthStore(s => s.fetchMe);
  const [step, setStep] = useState(initialStep || 1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<OnboardingPayload>>({
    timezone: user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    availabilities: [1, 2, 3, 4, 5].map(day => ({
      dayOfWeek: day, startTime: '09:00', endTime: '17:00'
    })),
    location: 'google_meet',
    role: '',
  });

  const nextStep = () => {
    setStep(Math.min(5, step + 1));
  };

  const prevStep = () => {
    setStep(Math.max(1, step - 1));
  };

  const onUpdateField = (key: keyof OnboardingPayload, val: any) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  const finalizeOnboarding = async () => {
    setIsLoading(true);
    try {
      if (!formData.role) {
        toast.error("Please select your role.");
        return;
      }
      await api.post("/auth/onboarding", formData);
      await fetchMe();
      toast.success("Welcome to Calendly!");
      router.push("/app/scheduling/meeting_types/user/me");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col items-center pt-8 md:pt-16 pb-12 px-4 animate-calendly-fade-in">
      <div className="w-full max-w-[600px]">
        {/* Header Logo */}
        <div className="flex justify-center mb-8">
          <CalendlyLogo size="md" />
        </div>

        {/* Wizard Container */}
        <div className="bg-card w-full shadow-calendly border border-border rounded-xl flex flex-col">
          <Progress value={(step / 5) * 100} className="h-1.5 rounded-none rounded-t-xl bg-muted" />

          <div className="p-8 md:p-12 flex-1">
            {step === 1 && <WelcomeStep formData={formData} onUpdateField={onUpdateField} nextStep={nextStep} />}
            {step === 2 && <CalendarStep nextStep={nextStep} />}
            {step === 3 && <AvailabilityStep formData={formData} onUpdateField={onUpdateField} nextStep={nextStep} prevStep={prevStep} />}
            {step === 4 && <LocationStep formData={formData} onUpdateField={onUpdateField} nextStep={nextStep} prevStep={prevStep} />}
            {step === 5 && <RoleStep formData={formData} onUpdateField={onUpdateField} finalize={finalizeOnboarding} isLoading={isLoading} prevStep={prevStep} />}
          </div>
        </div>
      </div>
    </div>
  );
}
