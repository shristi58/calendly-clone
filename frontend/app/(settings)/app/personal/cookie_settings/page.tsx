"use client";

import { useState } from "react";

export default function CookieSettingsPage() {
  const [essential, setEssential] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  return (
    <div className="w-full pb-24">
      {/* Header */}
      <div className="mb-6 border-b border-[#E5E7EB] pb-5">
        <p className="text-[13px] text-[#006BFF] font-medium mb-1">Account details</p>
        <h1 className="text-[22px] font-bold text-[#1A1A1A] leading-tight">
          Cookie settings
        </h1>
      </div>

      <div className="max-w-[520px]">
        <p className="text-[14px] text-[#4D5562] mb-8 leading-relaxed">
          We use cookies to improve your experience, analyze site traffic, and for
          marketing purposes. You can manage your preferences below.
        </p>

        {/* Essential Cookies */}
        <div className="flex items-start justify-between gap-4 py-5 border-b border-[#E5E7EB]">
          <div className="flex-1">
            <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-1">
              Essential cookies
            </h3>
            <p className="text-[13px] text-[#6B7280] leading-relaxed">
              Required for the site to function. These cannot be disabled.
            </p>
          </div>
          {/* Always enabled toggle */}
          <div className="shrink-0 mt-1">
            <div className="relative w-[44px] h-[24px]">
              <div className="w-full h-full bg-[#006BFF] rounded-full opacity-60 cursor-not-allowed" />
              <div className="absolute top-[2px] right-[2px] w-[20px] h-[20px] bg-white rounded-full shadow-sm" />
            </div>
          </div>
        </div>

        {/* Analytics Cookies */}
        <div className="flex items-start justify-between gap-4 py-5 border-b border-[#E5E7EB]">
          <div className="flex-1">
            <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-1">
              Analytics cookies
            </h3>
            <p className="text-[13px] text-[#6B7280] leading-relaxed">
              Help us understand how visitors use our site so we can improve it.
            </p>
          </div>
          <div className="shrink-0 mt-1">
            <button
              onClick={() => setAnalytics(!analytics)}
              className={`relative w-[44px] h-[24px] rounded-full transition-colors duration-200 ${
                analytics ? "bg-[#006BFF]" : "bg-[#D1D5DB]"
              }`}
            >
              <div
                className={`absolute top-[2px] w-[20px] h-[20px] bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  analytics ? "right-[2px]" : "left-[2px]"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Marketing Cookies */}
        <div className="flex items-start justify-between gap-4 py-5 border-b border-[#E5E7EB]">
          <div className="flex-1">
            <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-1">
              Marketing cookies
            </h3>
            <p className="text-[13px] text-[#6B7280] leading-relaxed">
              Used to deliver relevant advertisements and track campaign effectiveness.
            </p>
          </div>
          <div className="shrink-0 mt-1">
            <button
              onClick={() => setMarketing(!marketing)}
              className={`relative w-[44px] h-[24px] rounded-full transition-colors duration-200 ${
                marketing ? "bg-[#006BFF]" : "bg-[#D1D5DB]"
              }`}
            >
              <div
                className={`absolute top-[2px] w-[20px] h-[20px] bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  marketing ? "right-[2px]" : "left-[2px]"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <button className="px-6 py-2.5 bg-[#006BFF] text-white text-[14px] font-bold rounded-full hover:bg-[#0055CC] transition-colors">
            Save preferences
          </button>
        </div>
      </div>
    </div>
  );
}
