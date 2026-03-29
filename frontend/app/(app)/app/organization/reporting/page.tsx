"use client";

import { useState, useEffect } from "react";
import { HelpCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getReportingStats } from "@/lib/api";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Illustration SVG — matches the chart + avatar
   card from the live Calendly screenshot
   ───────────────────────────────────────────── */
function AnalyticsIllustration() {
  return (
    <div className="relative w-[420px] h-[280px] shrink-0 select-none pointer-events-none">
      {/* Light blue organic blob background */}
      <svg viewBox="0 0 420 280" className="absolute inset-0 w-full h-full" fill="none">
        <path
          d="M180 20C240-5 370 10 390 80C410 150 400 220 340 250C280 280 160 275 100 250C40 225 10 170 20 110C30 50 120 45 180 20Z"
          fill="#E8F4FD"
        />
      </svg>

      {/* Avatar badge — "Sales Team - East Coast" */}
      <div className="absolute top-[10px] right-[5px] bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-[#E8E8E8] px-3 py-2 flex items-center gap-2 z-20">
        <div className="border border-dashed border-[#006BFF] rounded-lg px-2 py-1 text-[10px] font-semibold text-[#006BFF] whitespace-nowrap">
          Sales Team - East Coast
        </div>
        <div className="flex -space-x-1.5">
          {[1,2,3].map((i) => (
            <div key={i} className="w-6 h-6 rounded-full border-[1.5px] border-white overflow-hidden bg-gradient-to-br from-blue-200 to-blue-400">
              <img src={`https://i.pravatar.cc/48?img=${i+20}`} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Chart card */}
      <div className="absolute top-[60px] left-[20px] w-[330px] h-[200px] bg-white border border-dashed border-[#006BFF] rounded-xl shadow-sm z-10 p-4 flex flex-col">
        {/* Chart title */}
        <div className="text-[11px] font-semibold text-[#666] mb-1">Completed events trend</div>

        {/* Chart area */}
        <div className="flex-1 relative ml-6 mr-2 mb-5">
          {/* Y axis */}
          <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-between text-[8px] text-[#A6A6A6] font-medium">
            <span>2000</span>
            <span>1000</span>
            <span>0</span>
          </div>

          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            <div className="border-t border-[#F0F0F0]" />
            <div className="border-t border-[#F0F0F0]" />
            <div className="border-t border-[#E5E5E5]" />
          </div>

          {/* SVG chart lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 100" preserveAspectRatio="none">
            {/* Purple line */}
            <polyline
              points="0,75 35,60 70,80 105,40 140,50 175,25 210,35 260,20"
              fill="none" stroke="#7A5CE4" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
            />
            {/* Orange/yellow line */}
            <polyline
              points="0,85 35,70 70,55 105,65 140,45 175,60 210,40 260,30"
              fill="none" stroke="#FFA700" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
            />
          </svg>
        </div>

        {/* X axis labels */}
        <div className="flex justify-between text-[8px] text-[#A6A6A6] font-medium ml-6 mr-2">
          <span>July 1</span>
          <span>July 25</span>
          <span>Aug 1</span>
          <span>Sept 5</span>
          <span>Sept 26</span>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-[#7A5CE4] rounded-[1px]" />
            <span className="text-[8px] text-[#666]">Sales Team - East Coast</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-[#FFA700] rounded-[1px]" />
            <span className="text-[8px] text-[#666]">Sales Team - West Coast</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Analytics Page
   ───────────────────────────────────────────── */
export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"events" | "routing">("events");

  useEffect(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    getReportingStats(thirtyDaysAgo.getTime(), now.getTime())
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const metrics = data?.metrics || {
    createdEvents: 0,
    completedEvents: 0,
    rescheduledEvents: 0,
    canceledEvents: 0,
  };

  return (
    <div className="w-full flex flex-col font-sans text-[#1A1A1A]">
      {/* ── Page Header ── */}
      <div className="flex items-center gap-2 mb-1">
        <h1 className="text-[26px] font-bold text-[#1A1A1A] leading-tight">Analytics</h1>
        <button className="text-[#666] hover:text-[#1A1A1A] transition-colors mt-0.5">
          <HelpCircle className="size-[18px]" strokeWidth={2} />
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-6 border-b border-[#E5E5E5] mt-2">
        <button
          onClick={() => setActiveTab("events")}
          className={cn(
            "pb-3 text-[15px] font-semibold transition-colors relative",
            activeTab === "events"
              ? "text-[#1A1A1A]"
              : "text-[#666] hover:text-[#1A1A1A]"
          )}
        >
          Events
          {activeTab === "events" && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#006BFF] rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("routing")}
          className={cn(
            "pb-3 text-[15px] font-semibold transition-colors relative",
            activeTab === "routing"
              ? "text-[#1A1A1A]"
              : "text-[#666] hover:text-[#1A1A1A]"
          )}
        >
          Routing
          {activeTab === "routing" && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#006BFF] rounded-t-full" />
          )}
        </button>
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "events" && (
        <div className="mt-6 flex flex-col gap-6 animate-in fade-in duration-300">
          {/* ── Empty State Hero Card ── */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between border border-[#E5E5E5] rounded-xl bg-white px-10 py-10 overflow-hidden">
            {/* Left text */}
            <div className="flex-1 flex flex-col max-w-[520px]">
              <span className="text-[#808080] text-sm font-medium mb-3">No Analytics Yet</span>
              <h2 className="text-[22px] font-bold text-[#1A1A1A] leading-snug mb-5">
                Improve team scheduling using trends from booked meetings
              </h2>

              <ul className="flex flex-col gap-2 mb-5 text-[#666] text-[15px] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="mt-[9px] w-[5px] h-[5px] rounded-full bg-[#1A1A1A] shrink-0" />
                  Easily understand how scheduling impacts your business.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-[9px] w-[5px] h-[5px] rounded-full bg-[#1A1A1A] shrink-0" />
                  Demonstrate the value of proposed scheduling changes.
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-[9px] w-[5px] h-[5px] rounded-full bg-[#1A1A1A] shrink-0" />
                  Get crucial buy-in from leaders and stakeholders.
                </li>
              </ul>

              <Link
                href="#"
                className="text-[#006BFF] text-[15px] font-semibold flex items-center gap-1.5 mb-7 hover:underline"
              >
                <span className="flex items-center justify-center w-[18px] h-[18px] rounded-full border-2 border-[#006BFF] text-[10px] font-bold leading-none">
                  ?
                </span>
                Learn more
                <span className="text-sm">{">"}</span>
              </Link>

              <Button className="w-fit h-11 px-6 bg-[#006BFF] hover:bg-[#0060E6] text-white font-semibold rounded-full text-[15px] shadow-sm">
                <Plus className="mr-1.5 size-[18px]" strokeWidth={2.5} />
                Book your first meeting
              </Button>
            </div>

            {/* Right illustration */}
            <div className="hidden lg:flex justify-end mt-4 lg:mt-0">
              <AnalyticsIllustration />
            </div>
          </div>

          {/* ── EVENT DATA Section ── */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-[#A6A6A6] uppercase tracking-widest">
              Event Data
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Created", value: metrics.createdEvents },
                { label: "Completed", value: metrics.completedEvents },
                { label: "Rescheduled", value: metrics.rescheduledEvents },
                { label: "Canceled", value: metrics.canceledEvents },
              ].map((card) => (
                <div
                  key={card.label}
                  className="bg-white border border-[#E5E5E5] rounded-xl p-6 min-h-[110px] flex flex-col justify-between"
                >
                  <div className="text-[32px] font-bold text-[#A6A6A6] leading-none">
                    {card.value}
                  </div>
                  <div className="text-[14px] font-medium text-[#A6A6A6] mt-auto pt-4">
                    {card.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "routing" && (
        <div className="mt-10 flex flex-col items-center justify-center text-center py-16 animate-in fade-in duration-300">
          <div className="text-[#A6A6A6] text-[15px] font-medium">
            Routing analytics will appear here once routing forms are active.
          </div>
        </div>
      )}
    </div>
  );
}
