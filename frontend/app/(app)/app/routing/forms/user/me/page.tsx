"use client";

import { ArrowRightLeft, Plus, Info, GitMerge, Split, Filter as FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RoutingPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[1000px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-[20px] font-bold text-[#1A1A1A]">Routing</h1>
          <button className="text-[#666666] hover:text-[#1A1A1A] transition-colors">
            <Info className="size-[18px]" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[#D9D9D9] text-[14px] font-medium">
        <button className="pb-3 relative text-[#006BFF]">
          Routing forms
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#006BFF]" />
        </button>
      </div>

      {/* Empty State */}
      <div className="border border-[#E5E5E5] rounded-xl bg-white shadow-sm">
        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
          <div className="w-20 h-20 bg-gradient-to-br from-[#E5F1FF] to-[#F0F4FF] rounded-full flex items-center justify-center mb-6">
            <ArrowRightLeft className="size-10 text-[#006BFF]" strokeWidth={1.5} />
          </div>
          <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-2">
            Route invitees to the right person
          </h2>
          <p className="text-[14px] text-[#666666] mb-8 max-w-[440px]">
            Build routing forms to qualify and route leads to the right person on your team based on their answers.
          </p>

          {/* Feature icons */}
          <div className="flex items-center gap-8 mb-8">
            {[
              { icon: FilterIcon, label: "Qualify leads" },
              { icon: GitMerge, label: "Smart routing" },
              { icon: Split, label: "Conditional logic" },
            ].map((feature) => (
              <div key={feature.label} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-[#F5F5F5] flex items-center justify-center">
                  <feature.icon className="size-6 text-[#666666]" strokeWidth={1.5} />
                </div>
                <span className="text-[12px] text-[#666666] font-medium">{feature.label}</span>
              </div>
            ))}
          </div>

          <Button
            disabled
            className="h-[44px] rounded-full bg-[#006BFF] hover:bg-[#005AE0] px-6 text-[14px] font-semibold shadow-sm opacity-50"
          >
            <Plus className="size-4 mr-2" strokeWidth={2.5} />
            Create routing form
          </Button>
          <p className="text-[12px] text-[#999999] mt-3">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
