"use client";

import { Users, Search, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactsPage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[1000px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-[20px] font-bold text-[#1A1A1A]">Contacts</h1>
          <button className="text-[#666666] hover:text-[#1A1A1A] transition-colors">
            <Info className="size-[18px]" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative w-full max-w-[320px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-[18px] text-[#666666]" strokeWidth={2} />
        <Input
          placeholder="Search contacts"
          className="pl-9 h-10 border-[#D9D9D9] shadow-sm rounded-lg focus-visible:ring-[#006BFF]"
          disabled
        />
      </div>

      {/* Empty State */}
      <div className="border border-[#E5E5E5] rounded-xl bg-white shadow-sm">
        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
          <div className="w-20 h-20 bg-gradient-to-br from-[#E5F1FF] to-[#F0F4FF] rounded-full flex items-center justify-center mb-6">
            <Users className="size-10 text-[#006BFF]" strokeWidth={1.5} />
          </div>
          <h2 className="text-[20px] font-bold text-[#1A1A1A] mb-2">
            No contacts yet
          </h2>
          <p className="text-[14px] text-[#666666] mb-6 max-w-[400px]">
            Contacts are automatically added when someone books a meeting with you through your scheduling links.
          </p>
          <Button
            disabled
            className="h-[44px] rounded-full bg-[#006BFF] hover:bg-[#005AE0] px-6 text-[14px] font-semibold shadow-sm opacity-50"
          >
            <Plus className="size-4 mr-2" strokeWidth={2.5} />
            Import contacts
          </Button>
          <p className="text-[12px] text-[#999999] mt-3">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
