"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState<"booking" | "blocked">("booking");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-full pb-24">
      {/* Header */}
      <div className="mb-6 border-b border-[#E5E7EB] pb-5">
        <p className="text-[13px] text-[#006BFF] font-medium mb-1">Account details</p>
        <h1 className="text-[22px] font-bold text-[#1A1A1A] leading-tight">
          Security
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#E5E7EB] mb-6">
        <button
          onClick={() => setActiveTab("booking")}
          className={`px-4 py-2.5 text-[14px] font-semibold transition-colors relative ${
            activeTab === "booking"
              ? "text-[#006BFF]"
              : "text-[#6B7280] hover:text-[#1A1A1A]"
          }`}
        >
          Booking
          {activeTab === "booking" && (
            <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#006BFF] rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("blocked")}
          className={`px-4 py-2.5 text-[14px] font-semibold transition-colors relative ${
            activeTab === "blocked"
              ? "text-[#006BFF]"
              : "text-[#6B7280] hover:text-[#1A1A1A]"
          }`}
        >
          Blocked sources
          {activeTab === "blocked" && (
            <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#006BFF] rounded-t-full" />
          )}
        </button>
      </div>

      {activeTab === "booking" && (
        <div>
          <h2 className="text-[16px] font-bold text-[#1A1A1A] mb-2">Booking</h2>
          <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-2">
            Require email verification to book
          </h3>
          <p className="text-[14px] text-[#4D5562] mb-6 leading-relaxed max-w-[600px]">
            For Event Types with email verification enabled, invitees must confirm their
            email before completing a booking.{" "}
            <a href="#" className="text-[#006BFF] hover:underline">Learn more</a>
          </p>

          {/* Search */}
          <div className="relative mb-6 max-w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search event types"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-[14px] border border-[#D1D5DB] rounded-lg bg-white focus:outline-none focus:border-[#006BFF] focus:ring-2 focus:ring-[#006BFF]/20 transition-all"
            />
          </div>

          {/* Table */}
          <div className="border border-[#E5E7EB] rounded-lg overflow-hidden bg-white">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  <th className="px-4 py-3 text-[13px] font-semibold text-[#1A1A1A]">
                    <div className="flex items-center gap-1">
                      Name
                      <svg viewBox="0 0 16 16" className="size-3.5 text-[#6B7280]"><path d="M8 3l4 5H4l4-5z" fill="currentColor"/></svg>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-[13px] font-semibold text-[#1A1A1A]">
                    <div className="flex items-center gap-1">
                      Verification
                      <svg viewBox="0 0 16 16" className="size-3.5 text-[#6B7280]"><path d="M8 3l4 5H4l4-5zM8 13l4-5H4l4 5z" fill="currentColor"/></svg>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-[13px] font-semibold text-[#1A1A1A]">Type</th>
                  <th className="px-4 py-3 text-[13px] font-semibold text-[#1A1A1A]">Owned by</th>
                  <th className="px-4 py-3 text-[13px] font-semibold text-[#1A1A1A]">Team</th>
                  <th className="px-4 py-3 text-[13px] font-semibold text-[#1A1A1A]">
                    <div className="flex items-center gap-1">
                      Last edited
                      <svg viewBox="0 0 16 16" className="size-3.5 text-[#6B7280]"><path d="M8 3l4 5H4l4-5zM8 13l4-5H4l4 5z" fill="currentColor"/></svg>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="size-4 rounded border-[#D1D5DB] text-[#006BFF] focus:ring-[#006BFF]" />
                      <div className="size-3 rounded-full bg-[#7C3AED]" />
                      <span className="text-[14px] font-medium text-[#1A1A1A]">New Meeting</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[14px] text-[#6B7280]">—</td>
                  <td className="px-4 py-3 text-[14px] text-[#4D5562]">One-on-One</td>
                  <td className="px-4 py-3 text-[14px] text-[#4D5562]">{/* Owner name from context */}—</td>
                  <td className="px-4 py-3 text-[14px] text-[#6B7280]">—</td>
                  <td className="px-4 py-3 text-[14px] text-[#4D5562]">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "blocked" && (
        <div>
          <h2 className="text-[16px] font-bold text-[#1A1A1A] mb-2">Blocked sources</h2>
          <p className="text-[14px] text-[#4D5562] mb-6 leading-relaxed">
            Block specific email addresses or domains from booking meetings with you.
          </p>
          <div className="border border-[#E5E7EB] rounded-lg p-8 bg-white text-center">
            <p className="text-[14px] text-[#6B7280]">No blocked sources yet.</p>
          </div>
        </div>
      )}
    </div>
  );
}
