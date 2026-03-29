"use client";

import { useState, useEffect, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CalendlyLogo } from "@/components/shared/calendly-logo";
import { useAuthStore } from "@/stores/auth-store";
import { api } from "@/lib/api";
import { ArrowLeft, Loader2, ArrowRight, ChevronDown, Globe } from "lucide-react";
import { toast } from "sonner";

function OAuthErrorToast() {
  const params = useSearchParams();
  useEffect(() => {
    const error = params.get("error");
    if (error) {
      const message = decodeURIComponent(error).replace(/_/g, " ");
      toast.error(`Sign-in failed: ${message}`, { duration: 6000 });
    }
  }, [params]);
  return null;
}

type CheckEmailResult =
  | { exists: false }
  | { exists: true; hasPassword: boolean; providers: string[] };

const PROVIDER_LABELS: Record<string, string> = { google: "Google", microsoft: "Microsoft" };

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

function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [step, setStep] = useState<"email" | "password" | "oauth">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [oauthProviders, setOauthProviders] = useState<string[]>([]);

  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    startTransition(async () => {
      try {
        const result = await api.post<CheckEmailResult>("/auth/check-email", { email });
        if (!result.exists) {
          router.push(`/register?email=${encodeURIComponent(email)}`);
          return;
        }
        if (result.hasPassword) setStep("password");
        else { setOauthProviders(result.providers); setStep("oauth"); }
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const user = await login(email, password);
    if (user) router.push(user.isOnboarded ? "/app/scheduling/meeting_types/user/me" : "/getting-started");
    else setIsSubmitting(false);
  };

  const handleOAuth = (provider: "google" | "microsoft") => {
    window.location.href = `/api/auth/${provider}`;
  };

  const handleBack = () => { setStep("email"); setPassword(""); setOauthProviders([]); };

  /* ━━━ STEP 2b: OAuth-only (minimal page — matches Calendly exactly) ━━━ */
  if (step === "oauth") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <Suspense fallback={null}><OAuthErrorToast /></Suspense>
        <div className="mb-5"><CalendlyLogo size="lg" /></div>
        <p className="text-[16px] font-semibold text-[#006BFF] mb-0.5">Welcome back, {email}!</p>
        <button onClick={handleBack} className="text-[14px] text-[#006BFF] hover:underline mb-10" id="login-not-me">(This is not me.)</button>
        <div className="w-full max-w-[480px] bg-white rounded-xl border border-[#E8E8E8] shadow-[0_1px_4px_rgba(0,0,0,0.05)] py-10 px-10 flex flex-col items-center gap-5">
          {oauthProviders.map((provider) => (
            <button key={provider} id={`login-${provider}`} onClick={() => handleOAuth(provider as "google" | "microsoft")}
              className="h-[44px] px-6 text-[14px] font-bold rounded-full bg-[#006BFF] hover:bg-[#0057D4] text-white flex items-center justify-center gap-2.5 transition-colors">
              {provider === "google" ? <GoogleIcon /> : <MicrosoftIcon />}
              Log In with {PROVIDER_LABELS[provider] ?? provider}
            </button>
          ))}
          <p className="text-[14px] text-[#333]">Don&apos;t have an account? <Link href="/register" className="text-[#006BFF] hover:underline" id="login-signup-oauth">Sign up</Link>.</p>
        </div>
        <button className="mt-10 flex items-center gap-1 text-[14px] text-[#006BFF] hover:underline">
          <Globe className="size-4" /> English <ChevronDown className="size-3" />
        </button>
      </div>
    );
  }

  /* ━━━ STEP 1 & 2a: Full page with marketing navbar ━━━ */
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
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
          <Link href="/register">
            <button className="h-[40px] px-6 text-[14px] font-bold rounded-[6px] bg-[#006BFF] hover:bg-[#0057D4] text-white transition-colors">Get started</button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        {step === "email" && (
          <>
            <h1 className="text-[36px] font-bold text-[#1A1A1A] mb-10 tracking-tight text-center leading-tight">
              Log in to your account
            </h1>

            <div className="w-full max-w-[400px] bg-white border border-[#E8E8E8] shadow-sm rounded-[10px] p-10">
              <form onSubmit={handleEmailContinue} className="flex flex-col gap-5">
                <div className="relative w-full group">
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    autoFocus
                    required
                    className="peer w-full h-[48px] px-4 text-[15px] bg-white border border-[#BFBFBF] rounded-[6px] outline-none focus:border-[#006BFF] focus:ring-[3px] focus:ring-[#006BFF]/20 transition-all text-[#1A1A1A] placeholder:text-[#666]"
                  />
                  <label htmlFor="login-email" className="absolute left-3 -top-2.5 bg-white px-1 text-[13px] font-normal text-[#666] opacity-100 peer-placeholder-shown:opacity-0 peer-focus:opacity-100 transition-opacity pointer-events-none">
                    Email
                  </label>
                </div>
                <button
                  id="login-continue"
                  type="submit"
                  disabled={isPending}
                  className="h-[48px] text-[16px] font-bold rounded-[6px] bg-[#006BFF] hover:bg-[#0057D4] text-white w-full transition-colors flex items-center justify-center disabled:opacity-70"
                >
                  {isPending ? <Loader2 className="animate-spin mr-2 size-4" /> : null}
                  Continue
                </button>
              </form>

              <div className="flex items-center gap-4 my-5">
                <hr className="flex-1 border-[#E8E8E8]" />
                <span className="text-[13px] text-[#999] font-medium select-none">OR</span>
                <hr className="flex-1 border-[#E8E8E8]" />
              </div>

              <div className="flex flex-col gap-3">
                <button id="login-google" type="button" onClick={() => handleOAuth("google")}
                  className="h-[48px] w-full flex items-center justify-center gap-3 text-[14px] font-bold text-[#1A1A1A] bg-white border border-[#BFBFBF] rounded-[6px] hover:border-[#333] hover:bg-[#F9F9F9] transition-all">
                  <GoogleIcon /> Continue with Google
                </button>
                <button id="login-microsoft" type="button" onClick={() => handleOAuth("microsoft")}
                  className="h-[48px] w-full flex items-center justify-center gap-3 text-[14px] font-bold text-[#1A1A1A] bg-white border border-[#BFBFBF] rounded-[6px] hover:border-[#333] hover:bg-[#F9F9F9] transition-all">
                  <MicrosoftIcon /> Continue with Microsoft
                </button>
              </div>
            </div>

            <p className="mt-7 text-[15px] text-[#333]">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#006BFF] font-semibold hover:underline inline-flex items-center gap-1" id="login-signup-link">
                Sign up for free <ArrowRight className="size-3.5" />
              </Link>
            </p>
          </>
        )}

        {step === "password" && (
          <>
            <h1 className="text-[36px] font-bold text-[#1A1A1A] mb-10 tracking-tight text-center leading-tight">
              Log in to your account
            </h1>

            <div className="w-full max-w-[400px] bg-white border border-[#E8E8E8] shadow-sm rounded-[10px] p-10">
              <form onSubmit={handlePasswordLogin} className="flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-1">
                  <button type="button" onClick={handleBack} className="p-1.5 rounded-full text-[#666] hover:text-[#1A1A1A] hover:bg-[#F3F3F3] transition-colors" id="login-back">
                    <ArrowLeft className="size-4" />
                  </button>
                  <div className="flex-1 h-[44px] flex items-center px-4 bg-[#F3F3F3] rounded-[6px] border border-[#E8E8E8] text-[14px] text-[#666] truncate">{email}</div>
                </div>
                <div className="relative w-full">
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    autoFocus
                    required
                    className="peer w-full h-[48px] px-4 text-[15px] bg-white border border-[#BFBFBF] rounded-[6px] outline-none focus:border-[#006BFF] focus:ring-[3px] focus:ring-[#006BFF]/20 transition-all text-[#1A1A1A] placeholder:text-[#666]"
                  />
                  <label htmlFor="login-password" className="absolute left-3 -top-2.5 bg-white px-1 text-[13px] font-normal text-[#666] opacity-100 peer-placeholder-shown:opacity-0 peer-focus:opacity-100 transition-opacity pointer-events-none">
                    Password
                  </label>
                </div>
                <button
                  id="login-submit"
                  type="submit"
                  disabled={isSubmitting || !password}
                  className="h-[48px] text-[16px] font-bold rounded-[6px] bg-[#006BFF] hover:bg-[#0057D4] text-white w-full transition-colors flex items-center justify-center disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="animate-spin mr-2 size-4" /> : null}
                  Continue
                </button>
                <p className="text-center text-[14px] text-[#666] mt-1">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-[#006BFF] hover:underline font-semibold" id="login-signup-pass">Sign up for free</Link>
                </p>
              </form>
            </div>
          </>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-[#E8E8E8] py-12 px-6 lg:px-10">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
          {[
            { title: "Product", links: ["Scheduling automation", "Meeting Notetaker", "Payments", "Customizable availability", "Mobile apps", "Browser extensions", "Meeting routing", "Event Types", "Analytics", "Admin management"] },
            { title: "Integrations", links: ["Google ecosystem", "Microsoft ecosystem", "Calendars", "Video conferencing", "Payment processors", "Sales & CRM", "Recruiting & ATS", "Email messaging", "Embed Calendly", "Analytics", "Security & compliance"] },
            { title: "Calendly", links: ["Pricing", "Product overview", "Solutions", "For individuals", "For small businesses", "For large companies", "Compare", "Security", "Sign up for free", "Talk to sales", "Get a demo"] },
            { title: "Resources", links: ["Help center", "Resource center", "Blog", "Customer stories", "Calendly community", "Developer tools", "Release notes"] },
            { title: "Company", links: ["About us", "Leadership", "Careers", "Newsroom", "Become a partner", "Contact us"] },
          ].map((col) => (
            <div key={col.title}>
              <h3 className="text-[14px] font-bold text-[#1A1A1A] mb-3">{col.title}</h3>
              <ul className="flex flex-col gap-1.5">
                {col.links.map((link) => (
                  <li key={link}><a href="#" className="text-[13px] text-[#006BFF] hover:underline">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
