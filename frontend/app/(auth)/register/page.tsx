"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendlyLogo } from "@/components/shared/calendly-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/auth-store";
import { registerSchema, type RegisterFormData } from "@/lib/validators";
import { getTimezone } from "@/lib/auth";
import { ArrowRight, Check, Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const FEATURES = [
  "Multi-person and co-hosted meetings",
  "Round Robin meeting distribution",
  "Meeting reminders, follow-ups, and notifications",
  "Connect payment tools like PayPal or Stripe",
  "Remove Calendly branding",
];

export default function RegisterPage() {
  const router = useRouter();
  const registerUser = useAuthStore((s) => s.register);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    const timezone = getTimezone();
    const user = await registerUser(data.name, data.email, data.password, timezone);
    if (user) {
      if (!user.isOnboarded) {
        router.push("/getting-started");
      } else {
        router.push("/app/scheduling/meeting_types/user/me");
      }
    }
    setIsSubmitting(false);
  };

  const handleOAuthSignup = (provider: "google" | "microsoft") => {
    window.location.href = `${API_BASE}/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-background border-b border-border">
        <Link href="/">
          <CalendlyLogo size="md" />
        </Link>
        <Link href="/login">
          <Button variant="outline" className="calendly-btn-hover" id="signup-login-btn">
            Log In
          </Button>
        </Link>
      </header>

      {/* Main content — split panels */}
      <main className="flex-1 flex animate-calendly-fade-in">
        {/* Left Panel — Form */}
        <div className="flex-1 flex flex-col justify-center px-8 py-12 lg:px-16 xl:px-24">
          <div className="max-w-[500px]">
            <h1 className="text-4xl font-bold text-foreground tracking-tight mb-2">
              Create your free account
            </h1>
            <p className="text-muted-foreground mb-8">
              No credit card required. Upgrade anytime.
            </p>

            {/* Email form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="register-name" className="text-sm font-medium">
                  Name
                </Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Your full name"
                  autoComplete="name"
                  autoFocus
                  aria-invalid={!!errors.name}
                  {...register("name")}
                  className="h-12 text-base rounded-lg"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="register-email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                  className="h-12 text-base rounded-lg"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="register-password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                  className="h-12 text-base rounded-lg"
                />
                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                id="register-submit"
                type="submit"
                disabled={isSubmitting}
                className="h-12 text-base font-semibold rounded-lg calendly-btn-hover w-full"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                ) : null}
                Continue with email
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <Separator className="flex-1" />
              <span className="text-sm text-muted-foreground font-medium">OR</span>
              <Separator className="flex-1" />
            </div>

            {/* Social login */}
            <div className="flex flex-col gap-3">
              <Button
                id="register-google"
                variant="outline"
                className="h-12 text-base font-medium rounded-lg calendly-btn-hover w-full justify-center gap-3"
                onClick={() => handleOAuthSignup("google")}
              >
                <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>

              <Button
                id="register-microsoft"
                variant="outline"
                className="h-12 text-base font-medium rounded-lg calendly-btn-hover w-full justify-center gap-3"
                onClick={() => handleOAuthSignup("microsoft")}
              >
                <svg viewBox="0 0 21 21" className="size-5" aria-hidden="true">
                  <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                </svg>
                Continue with Microsoft
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Continue with Google or Microsoft to connect your calendar.
            </p>

            <p className="mt-6 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline inline-flex items-center gap-1"
                id="register-login-link"
              >
                Log In
                <ArrowRight className="size-3.5" />
              </Link>
            </p>
          </div>
        </div>

        {/* Right Panel — Features */}
        <div className="hidden lg:flex flex-1 flex-col justify-center px-12 xl:px-16 bg-background">
          <div className="max-w-md">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-primary/30 text-primary text-sm font-medium mb-6">
              Try Teams plan free
            </div>

            <h2 className="text-2xl font-bold text-foreground tracking-tight mb-2">
              Explore premium features with your free 14-day Teams plan trial
            </h2>

            <ul className="flex flex-col gap-4 mt-8">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-foreground">
                  <Check
                    className="size-5 text-primary mt-0.5 shrink-0"
                    strokeWidth={2.5}
                  />
                  <span className="text-base">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Social proof */}
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
                Join leading companies using the #1 scheduling tool
              </p>
              <div className="flex items-center gap-6 opacity-40">
                <span className="text-sm font-bold tracking-tight">Dropbox</span>
                <span className="text-sm font-bold tracking-tight">ancestry</span>
                <span className="text-sm font-bold tracking-tight">zendesk</span>
                <span className="text-sm font-bold tracking-tight">L&apos;ORÉAL</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
