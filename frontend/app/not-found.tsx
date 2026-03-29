"use client";

import Link from "next/link";
import { Globe, MessageCircle } from "lucide-react";
import { CalendlyLogo } from "@/components/shared/calendly-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Custom Simple Chevron for nav items & return link
 * to match Calendly's production style (thin, downward caret)
 */
function SimpleCaret({ className, direction = "down" }: { className?: string, direction?: "down" | "right" }) {
  return (
    <svg
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      className={cn("transition-transform", direction === "right" && "-rotate-90", className)}
    >
      <path
        d="M1 1L5 5L9 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-[#006BFF] selection:text-white relative overflow-hidden">
      {/* ── Header ── */}
      <header className="h-[72px] flex items-center justify-between px-6 lg:px-12 max-w-[1440px] mx-auto w-full z-10">
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center shrink-0">
            <CalendlyLogo size="md" className="scale-[1.15]" />
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {["Product", "Solutions", "Resources", "Pricing"].map((item) => (
              <button
                key={item}
                className="text-[16px] font-bold text-[#0B3558] hover:text-[#006BFF] transition-colors flex items-center gap-2 group"
              >
                {item}
                {["Product", "Solutions", "Resources"].includes(item) && (
                  <SimpleCaret className="mt-0.5 opacity-60 group-hover:opacity-100" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-8">
            <button className="flex items-center gap-1.5 text-[14px] font-bold text-[#476788] hover:text-[#006BFF] transition-colors">
              <Globe className="size-[18px] opacity-80" />
              English
              <SimpleCaret className="size-2 opacity-50 ml-0.5" />
            </button>
            <Link
              href="/sales"
              className="text-[14px] font-bold text-[#476788] hover:text-[#006BFF] transition-colors"
            >
              Talk to sales
            </Link>
          </div>

          <Link href="/login">
            <Button
              className="bg-[#006BFF] hover:bg-[#0060E6] text-white rounded-md px-6 py-5 text-[15px] font-bold transition-all shadow-none h-[44px]"
            >
              My Account
            </Button>
          </Link>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 pb-20 mt-[-20px]">
        <div className="w-full max-w-[850px] bg-white rounded-[40px] border border-[#F0F0F0] shadow-[0_20px_50px_rgba(31,51,73,0.06)] p-12 lg:px-24 lg:py-24 flex flex-col items-center text-center">

          {/* 404 pill */}
          <div className="bg-[#006BFF] text-white text-[11px] font-black tracking-widest px-2.5 py-0.5 rounded-[4px] mb-10 translate-y-[-10px]">
            404
          </div>

          <h1 className="text-[#0B3558] text-[48px] lg:text-[56px] font-black leading-tight mb-6 tracking-tight">
            Page not found
          </h1>

          <p className="text-[#4D5055] text-[18px] lg:text-[20px] max-w-[480px] mb-12 font-medium leading-relaxed opacity-90">
            Sorry, but the page you were looking for could not be found.
          </p>

          <Link
            href="/"
            className="group flex items-center gap-1.5 text-[#006BFF] text-[18px] font-bold hover:text-[#005BE6] transition-all"
          >
            Return to homepage
            <SimpleCaret direction="down" className="size-3 mt-1 stroke-[2.5px]" />
          </Link>
        </div>
      </main>

      {/* ── Decorative Background (Single Smooth Wave) ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[320px] pointer-events-none z-0 translate-y-[80px]">
        <svg
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full opacity-40"
          preserveAspectRatio="none"
        >
          <path
            d="M0 160C120 120 280 80 480 100C680 120 840 240 1080 260C1320 280 1440 200 1440 200V320H0V160Z"
            fill="#F4F8FB"
          />
        </svg>
      </div>
    </div>
  );
}
