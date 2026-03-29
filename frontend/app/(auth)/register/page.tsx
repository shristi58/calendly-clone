"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendlyLogo } from "@/components/shared/calendly-logo";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth-store";
import { registerSchema, type RegisterFormData } from "@/lib/validators";
import { getTimezone } from "@/lib/auth";
import { Loader2, ArrowRight, ChevronDown, Globe, Eye, EyeOff, Check } from "lucide-react";
import { toast } from "sonner";

function OAuthErrorToast() {
  const params = useSearchParams();
  useEffect(() => {
    const error = params.get("error");
    if (error) {
      toast.error(`Sign-up failed: ${decodeURIComponent(error).replace(/_/g, " ")}`, { duration: 6000 });
    }
  }, [params]);
  return null;
}

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const MicrosoftIcon = () => (
  <svg viewBox="0 0 21 21" className="size-4" aria-hidden="true">
    <rect x="1" y="1" width="9" height="9" fill="#F25022" />
    <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
    <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
    <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
  </svg>
);

const features = [
  "Multi-person and co-hosted meetings",
  "Round Robin meeting distribution",
  "Meeting reminders, follow-ups, and notifications",
  "Connect payment tools like PayPal or Stripe",
  "Remove Calendly branding",
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registerUser = useAuthStore((s) => s.register);

  const [step, setStep] = useState<"email" | "details">("email");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setValue("email", email);
    setStep("details");
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    const user = await registerUser(data.name, data.email, data.password, getTimezone());
    if (user) router.push(user.isOnboarded ? "/app/scheduling/meeting_types/user/me" : "/getting-started");
    setIsSubmitting(false);
  };

  const handleOAuth = (provider: "google" | "microsoft") => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Suspense fallback={null}><OAuthErrorToast /></Suspense>

      {/* ── Micro top bar ── */}
      <div className="bg-white flex justify-end items-center gap-4 px-6 lg:px-10 h-[32px] text-[12px]">
        <button className="flex items-center gap-1 text-[#333] hover:text-[#006BFF] transition-colors">
          <Globe className="size-3" /> English <ChevronDown className="size-2.5" />
        </button>
        <span className="text-[#333]">Talk to sales</span>
      </div>

      {/* ── Main Navbar ── */}
      <header className="bg-white border-b border-[#E8E8E8] px-6 lg:px-10">
        <div className="max-w-[1200px] mx-auto h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/"><CalendlyLogo size="md" /></Link>
            <nav className="hidden md:flex items-center gap-7">
              {["Product", "Solutions", "Resources"].map((item) => (
                <button key={item} className="text-[15px] font-medium text-[#333] hover:text-[#006BFF] transition-colors flex items-center gap-1">
                  {item} <ChevronDown className="size-3.5 text-[#666]" />
                </button>
              ))}
              <Link href="#" className="text-[15px] font-medium text-[#333] hover:text-[#006BFF] transition-colors">Pricing</Link>
            </nav>
          </div>
          <Link href="/login" className="text-[15px] font-bold text-[#006BFF] hover:underline">Log In</Link>
        </div>
      </header>

      <main className="flex-1 flex">

        <div className="flex-1 flex flex-col justify-center px-10 lg:px-20 py-14">
          {step === "email" && (
             <div className="max-w-[400px]">
              <h1 className="text-[32px] font-bold tracking-tight text-[#112A46] mb-2 leading-tight">
                Create your free account
              </h1>
              <p className="text-[15px] text-[#4D5055] mb-8">
                No credit card required. Upgrade anytime.
              </p>

              <form onSubmit={handleEmailContinue} className="flex flex-col gap-4">
                <div className="relative w-full group">
                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    autoFocus
                    required
                    className="peer w-full h-[48px] px-4 text-[15px] bg-white border border-[#BFBFBF] rounded-[6px] outline-none focus:border-[#006BFF] focus:ring-[3px] focus:ring-[#006BFF]/20 transition-all text-[#1A1A1A] placeholder:text-[#666]"
                  />
                  <label htmlFor="register-email" className="absolute left-3 -top-2.5 bg-white px-1 text-[13px] font-normal text-[#666] opacity-100 peer-placeholder-shown:opacity-0 peer-focus:opacity-100 transition-opacity pointer-events-none">
                    Email
                  </label>
                </div>
                <button
                  id="register-continue"
                  type="submit"
                  className="h-[48px] text-[16px] font-bold rounded-[6px] bg-[#006BFF] hover:bg-[#0057D4] text-white w-full transition-colors"
                >
                  Continue with email
                </button>
              </form>

              <div className="flex items-center gap-4 my-5">
                <hr className="flex-1 border-[#E8E8E8]" />
                <span className="text-[13px] text-[#999] font-medium select-none">OR</span>
                <hr className="flex-1 border-[#E8E8E8]" />
              </div>

              <div className="flex flex-col gap-3">
                <button id="register-google" onClick={() => handleOAuth("google")}
                  className="h-[48px] w-full flex items-center justify-center gap-3 text-[14px] font-bold text-[#1A1A1A] bg-white border border-[#BFBFBF] rounded-[6px] hover:border-[#333] hover:bg-[#F9F9F9] transition-all">
                  <GoogleIcon /> Continue with Google
                </button>
                <button id="register-microsoft" onClick={() => handleOAuth("microsoft")}
                  className="h-[48px] w-full flex items-center justify-center gap-3 text-[14px] font-bold text-[#1A1A1A] bg-white border border-[#BFBFBF] rounded-[6px] hover:border-[#333] hover:bg-[#F9F9F9] transition-all">
                  <MicrosoftIcon /> Continue with Microsoft
                </button>
              </div>

              <p className="text-[13px] text-[#666] mt-6">
                Continue with <button type="button" onClick={() => handleOAuth("google")} className="text-[#006BFF] font-medium hover:underline">Google</button> or <button type="button" onClick={() => handleOAuth("microsoft")} className="text-[#006BFF] font-medium hover:underline">Microsoft</button> to connect your calendar.
              </p>

              <p className="text-[14px] text-[#1A1A1A] mt-6">
                Already have an account? <Link href="/login" className="text-[#006BFF] font-medium hover:underline">Log In</Link>
              </p>
            </div>
          )}

          {step === "details" && (
            <div className="max-w-[400px]">
              <h1 className="text-[32px] font-bold text-[#112A46] mb-2 tracking-tight leading-[1.15]">
                Create your free account
              </h1>
              <p className="text-[14px] text-[#666] mb-7">
                Signing up as <span className="font-medium text-[#1A1A1A]">{email}</span> ·{" "}
                <button onClick={() => setStep("email")} className="text-[#006BFF] hover:underline">Change</button>
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <input type="hidden" {...register("email")} />

                <div className="flex flex-col gap-1.5">
                  <div className="relative w-full">
                    <Input id="register-name" type="text" autoComplete="name" autoFocus aria-invalid={!!errors.name} {...register("name")} placeholder="Full name"
                      className="peer h-[48px] text-[15px] rounded-[6px] border-[#BFBFBF] focus:border-[#006BFF] focus:ring-[3px] focus:ring-[#006BFF]/20 transition-all placeholder:text-[#666] outline-none" />
                    <label htmlFor="register-name" className="absolute left-3 -top-2.5 bg-white px-1 text-[13px] font-normal text-[#666] opacity-100 peer-placeholder-shown:opacity-0 peer-focus:opacity-100 transition-opacity pointer-events-none">
                      Full name
                    </label>
                  </div>
                  {errors.name && <p className="text-[13px] text-[#DC2626]">{errors.name.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="relative w-full">
                    <Input id="register-password" type={showPassword ? "text" : "password"} autoComplete="new-password" aria-invalid={!!errors.password} {...register("password")} placeholder="Choose a password (at least 12 characters)"
                      className="peer h-[48px] text-[15px] rounded-[6px] border-[#BFBFBF] focus:border-[#006BFF] focus:ring-[3px] focus:ring-[#006BFF]/20 transition-all pr-10 placeholder:text-[#666] outline-none" />
                    <label htmlFor="register-password" className="absolute left-3 -top-2.5 bg-white px-1 text-[13px] font-normal text-[#666] opacity-100 peer-placeholder-shown:opacity-0 peer-focus:opacity-100 transition-opacity pointer-events-none">
                      Password
                    </label>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#666] z-10">
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[13px] text-[#DC2626]">{errors.password.message}</p>}
                </div>

                <button id="register-submit" type="submit" disabled={isSubmitting}
                  className="h-[48px] text-[16px] font-bold rounded-[6px] bg-[#006BFF] hover:bg-[#0057D4] text-white w-full transition-colors flex items-center justify-center disabled:opacity-70">
                  {isSubmitting ? <Loader2 className="animate-spin mr-2 size-4" /> : null}
                  Create Account
                </button>

                <p className="text-[12px] text-[#999] leading-relaxed">
                  By creating a Calendly account, you agree to{" "}
                  <a href="#" className="text-[#006BFF] hover:underline">Calendly&apos;s Terms</a> and{" "}
                  <a href="#" className="text-[#006BFF] hover:underline">Privacy Policy</a>.
                </p>
              </form>
            </div>
          )}
        </div>

        <div className="hidden lg:flex flex-1 bg-[#F7FAFF] border-l border-[#E8E8E8] flex-col justify-center px-12 xl:px-16 py-14">
          <div className="max-w-[480px]">
            <span className="inline-block px-3 py-1 text-[13px] font-bold text-[#006BFF] bg-[#006BFF]/10 rounded-full mb-7">
              Try Teams plan free
            </span>
            <h2 className="text-[28px] font-bold text-[#112A46] mb-7 leading-tight tracking-tight">
              Explore premium features with your free 14-day Teams plan trial
            </h2>
            <div className="flex flex-col gap-4 mb-12">
              {[
                "Multi-person and co-hosted meetings",
                "Round Robin meeting distribution",
                "Meeting reminders, follow-ups, and notifications",
                "Connect payment tools like PayPal or Stripe",
                "Remove Calendly branding"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="size-5 text-[#006BFF]" strokeWidth={2.5} />
                  <span className="text-[15px] font-normal text-[#4D5055]">{feature}</span>
                </div>
              ))}
            </div>
            <p className="text-[13px] text-[#999] italic mb-5">Join leading companies using the #1 scheduling tool</p>
            <div className="flex items-center gap-8 flex-wrap">
              {["Dropbox", "Ancestry", "Zendesk", "L'ORÉAL"].map((name) => (
                <span key={name} className="text-[15px] font-bold text-[#BFBFBF] tracking-wider">{name}</span>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-[#FAFAFA] border-t border-[#E8E8E8] py-4 px-6 lg:px-10">
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <button className="flex items-center gap-1 text-[13px] text-[#333]">
            <Globe className="size-3.5" /> English <ChevronDown className="size-3" />
          </button>
          <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#666]">
            <a href="#" className="hover:text-[#006BFF]">Privacy Policy</a>
            <a href="#" className="hover:text-[#006BFF]">Legal</a>
            <a href="#" className="hover:text-[#006BFF]">Status</a>
            <a href="#" className="hover:text-[#006BFF]">Cookie Settings</a>
            <a href="#" className="hover:text-[#006BFF]">Your Privacy Choices</a>
          </div>
          <span className="text-[13px] text-[#999]">Copyright Calendly {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
