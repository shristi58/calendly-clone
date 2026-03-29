"use client";

import { useAuthStore } from "@/stores/auth-store";

export default function CommunicationSettingsPage() {
  const { user, updateProfile } = useAuthStore();
  const notificationsEnabled = user?.emailNotifications ?? true;

  const handleToggle = () => {
    updateProfile({ emailNotifications: !notificationsEnabled });
  };

  return (
    <div className="w-full pb-24">
      {/* Header */}
      <div className="mb-6 border-b border-[#E5E7EB] pb-5">
        <p className="text-[13px] text-[#006BFF] font-medium mb-1">Account details</p>
        <h1 className="text-[22px] font-bold text-[#1A1A1A] leading-tight">
          Communication settings
        </h1>
      </div>

      <div className="max-w-[520px]">
        <h2 className="text-[14px] font-bold text-[#1A1A1A] mb-3">
          Email notifications when added to event types
        </h2>
        
        <div className="flex items-start gap-4 mb-4">
          {/* Proper CSS toggle */}
          <button
            onClick={handleToggle}
            className={`relative w-[44px] h-[24px] rounded-full transition-colors duration-200 shrink-0 mt-0.5 ${
              notificationsEnabled ? "bg-[#006BFF]" : "bg-[#D1D5DB]"
            }`}
          >
            <div
              className={`absolute top-[2px] w-[20px] h-[20px] bg-white rounded-full shadow-sm transition-transform duration-200 ${
                notificationsEnabled ? "right-[2px]" : "left-[2px]"
              }`}
            />
          </button>
          <span className="text-[14px] text-[#4D5562]">
            Receive an email when someone adds you as a host to an event type
          </span>
        </div>

        <p className="text-[14px] text-[#9CA3AF] mt-8">
          Your changes to this page are saved automatically.
        </p>
      </div>
    </div>
  );
}
