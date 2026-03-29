"use client";

import { Puzzle, Search, Info } from "lucide-react";
import { Input } from "@/components/ui/input";

const POPULAR_INTEGRATIONS = [
  { name: "Zoom", category: "Video Conferencing", color: "#2D8CFF" },
  { name: "Google Meet", category: "Video Conferencing", color: "#00832D" },
  { name: "Microsoft Teams", category: "Video Conferencing", color: "#6264A7" },
  { name: "Salesforce", category: "CRM", color: "#00A1E0" },
  { name: "HubSpot", category: "CRM", color: "#FF7A59" },
  { name: "Stripe", category: "Payments", color: "#635BFF" },
];

export default function IntegrationsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[1000px] mb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-[20px] font-bold text-[#1A1A1A]">Integrations & apps</h1>
          <button className="text-[#666666] hover:text-[#1A1A1A] transition-colors">
            <Info className="size-[18px]" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-[400px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-[#666666]" strokeWidth={2} />
        <Input
          placeholder="Search integrations & apps"
          className="pl-9 h-11 border-[#D9D9D9] shadow-sm rounded-lg focus-visible:ring-[#006BFF]"
          disabled
        />
      </div>

      {/* Banner */}
      <div className="bg-[#F0F4FF] border border-[#D1E4FF] rounded-xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-[#006BFF] text-white flex items-center justify-center shrink-0">
          <Puzzle className="size-5" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-[16px] font-bold text-[#1A1A1A]">Connect your favorite tools</h3>
          <p className="text-[14px] text-[#4D5055]">
            Coming soon: Sync your calendars, connect video conferencing, and automate workflows with your favorite apps.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        <h2 className="text-[18px] font-bold text-[#1A1A1A]">Popular integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {POPULAR_INTEGRATIONS.map((app) => (
            <div
              key={app.name}
              className="border border-[#E5E5E5] rounded-xl p-5 hover:border-[#006BFF] hover:shadow-md transition-all cursor-not-allowed opacity-70 bg-white"
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="size-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: app.color }}
                >
                  {app.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-[#1A1A1A]">{app.name}</h4>
                  <p className="text-[12px] text-[#666666]">{app.category}</p>
                </div>
              </div>
              <div className="text-[12px] font-semibold text-[#006BFF] pt-2 border-t border-[#F2F2F2]">
                Coming soon →
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
