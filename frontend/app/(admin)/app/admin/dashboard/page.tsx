"use client";

import { useEffect, useState } from "react";
import { HelpCircle, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminDashboardMetrics } from "@/lib/api";
import Link from "next/link";

/* ─────────────────────────────────────────────
   Illustration — matches the live Calendly 
   Admin dashboard empty state exactly:
   Blue organic blob + chart card with two lines
   + "Connected" floating badge with avatars
   ───────────────────────────────────────────── */
function AdminIllustration() {
  return (
    <div className="relative w-[440px] h-[300px] shrink-0 select-none pointer-events-none">
      {/* Blue organic blob (the swirly outline visible in the screenshot) */}
      <svg viewBox="0 0 440 300" className="absolute inset-0 w-full h-full" fill="none">
        {/* Filled light blob */}
        <path
          d="M180 25C250-10 400 20 415 100C430 180 400 250 330 270C260 290 140 280 80 250C20 220 -5 155 15 90C35 25 110 60 180 25Z"
          fill="#E3F0FC"
        />
        {/* Dark blue swoosh outline */}
        <path
          d="M160 35C230 0 390 15 410 95C430 175 405 245 335 265C265 285 150 275 85 245C20 215 0 160 15 95C30 30 90 70 160 35Z"
          stroke="#0B3558"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Dashed blue inner outline */}
        <path
          d="M175 45C240 10 385 25 400 100C415 175 395 240 330 260C265 280 155 270 95 245C35 220 10 165 25 100C40 35 110 80 175 45Z"
          stroke="#006BFF"
          strokeWidth="1.5"
          strokeDasharray="6 6"
          fill="none"
        />
      </svg>

      {/* "Connected" badge with avatars */}
      <div className="absolute top-[20px] right-[10px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-[#EBEBEB] px-4 py-2.5 flex items-center gap-3 z-20">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-[#1A1A1A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-bold text-[#1A1A1A] text-[13px]">Connected</span>
        </div>
        <div className="flex -space-x-2">
          {[10,11,12,13,14].map((i) => (
            <div key={i} className="w-7 h-7 rounded-full border-2 border-white overflow-hidden shadow-sm">
              <img src={`https://i.pravatar.cc/56?img=${i}`} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Chart card */}
      <div className="absolute top-[75px] left-[10px] w-[340px] h-[195px] bg-white border border-dashed border-[#006BFF] rounded-xl shadow-sm z-10 p-4 flex flex-col">
        <div className="text-[11px] font-semibold text-[#666] mb-1">Completed events trend</div>

        <div className="flex-1 relative ml-7 mr-2 mb-5">
          <div className="absolute -left-7 top-0 bottom-0 flex flex-col justify-between text-[8px] text-[#A6A6A6] font-medium">
            <span>2000</span>
            <span>1000</span>
            <span>0</span>
          </div>
          <div className="absolute inset-0 flex flex-col justify-between">
            <div className="border-t border-[#F0F0F0]" />
            <div className="border-t border-[#F0F0F0]" />
            <div className="border-t border-[#E5E5E5]" />
          </div>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 100" preserveAspectRatio="none">
            <polyline points="0,75 35,60 70,80 105,40 140,50 175,25 210,35 260,20" fill="none" stroke="#7A5CE4" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
            <polyline points="0,85 35,70 70,55 105,65 140,45 175,60 210,40 260,30" fill="none" stroke="#FFA700" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
          </svg>
        </div>

        <div className="flex justify-between text-[8px] text-[#A6A6A6] font-medium ml-7 mr-2">
          <span>July 1</span><span>July 25</span><span>Aug 1</span><span>Sept 5</span><span>Sept 26</span>
        </div>

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
   Admin Dashboard Page
   ───────────────────────────────────────────── */
export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAdminDashboardMetrics()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const metrics = data?.metrics || {
    createdEvents: 0,
    completedEvents: 0,
    canceledEvents: 0,
  };

  return (
    <div className="w-full flex flex-col">
      {/* ── Header ── */}
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-[26px] font-bold text-[#1A1A1A]">Dashboard</h1>
        <button className="text-[#666] hover:text-[#1A1A1A] transition-colors mt-0.5">
          <HelpCircle className="size-[18px]" strokeWidth={2} />
        </button>
      </div>

      {/* ── Hero Empty State Card ── */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between border border-[#E5E5E5] rounded-xl bg-white px-10 py-10 overflow-hidden">
        {/* Left content */}
        <div className="flex-1 flex flex-col max-w-[480px]">
          <span className="text-[#808080] text-sm font-medium mb-3">No Analytics Yet</span>
          <h2 className="text-[22px] font-bold text-[#1A1A1A] leading-snug mb-5">
            Monitor your organization in one place
          </h2>

          <ul className="flex flex-col gap-2 mb-5 text-[#666] text-[15px] leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="mt-[9px] w-[5px] h-[5px] rounded-full bg-[#1A1A1A] shrink-0" />
              Identify if new users need help with setup tasks
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-[9px] w-[5px] h-[5px] rounded-full bg-[#1A1A1A] shrink-0" />
              Track your team's weekly meeting activity
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-[9px] w-[5px] h-[5px] rounded-full bg-[#1A1A1A] shrink-0" />
              Use quick links to view team and analytics details
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
            <UserPlus className="mr-1.5 size-[18px]" strokeWidth={2} />
            Invite a teammate
          </Button>
        </div>

        {/* Right illustration */}
        <div className="hidden lg:flex justify-end mt-4 lg:mt-0">
          <AdminIllustration />
        </div>
      </div>

      {/* ── Activity last week ── */}
      <div className="mt-8 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[13px] font-medium text-[#A6A6A6] tracking-wide">Activity last week</h3>
          <Link
            href="/app/organization/reporting"
            className="text-[13px] font-medium text-[#A6A6A6] hover:text-[#1A1A1A] transition-colors flex items-center gap-1"
          >
            View Analytics <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { label: "Created events", value: metrics.createdEvents },
            { label: "Completed events", value: metrics.completedEvents },
            { label: "Canceled events", value: metrics.canceledEvents },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-white border border-[#E5E5E5] rounded-xl px-6 py-5 flex flex-col min-h-[120px]"
            >
              <div className="text-[28px] font-bold text-[#A6A6A6] leading-none mb-8">
                {card.value}
              </div>
              <div className="text-[14px] font-medium text-[#A6A6A6] mt-auto">
                {card.label}
              </div>
              <div className="text-[12px] text-[#A6A6A6] font-medium mt-1 flex items-center gap-0.5">
                <span className="text-base leading-none">▲</span> 0%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
