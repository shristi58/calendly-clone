"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useState, useEffect } from "react";

export default function MyLinkPage() {
  const { user, updateProfile } = useAuthStore();
  const [username, setUsername] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  const handleSave = async () => {
    if (!username.trim() || username === user?.username) return;
    setIsSaving(true);
    try {
      await updateProfile({ username: username.toLowerCase() });
    } catch {
      // Handled globally
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full pb-24">
      {/* Header */}
      <div className="mb-6 border-b border-[#E5E7EB] pb-5">
        <p className="text-[13px] text-[#006BFF] font-medium mb-1">Account details</p>
        <h1 className="text-[22px] font-bold text-[#1A1A1A] leading-tight">
          My link
        </h1>
      </div>

      <div className="max-w-[520px]">
        <p className="text-[14px] text-[#4D5562] mb-8 leading-relaxed">
          Changing your Calendly URL will mean that all of your copied links
          will no longer work and will need to be updated.
        </p>

        <div className="flex items-center mb-10">
          <span className="text-[14px] text-[#4D5562] mr-2 font-medium whitespace-nowrap">calendly.com/</span>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 h-[42px] px-3 text-[14px] text-[#1A1A1A] bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:border-[#006BFF] focus:ring-2 focus:ring-[#006BFF]/20 transition-all"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving || username === user?.username || !username.trim()}
          className="px-6 py-2.5 bg-[#006BFF] text-white text-[14px] font-bold rounded-full hover:bg-[#0055CC] transition-colors disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
