"use client";

import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";

export default function BrandingPage() {
  const { user, updateProfile } = useAuthStore();
  
  const [brandingLogo, setBrandingLogo] = useState<string | null>(null);
  const [useCalendlyBranding, setUseCalendlyBranding] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setBrandingLogo(user.brandingLogo || null);
      if (user.useCalendlyBranding !== undefined) {
        setUseCalendlyBranding(user.useCalendlyBranding);
      }
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setBrandingLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        brandingLogo,
        useCalendlyBranding,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setBrandingLogo(user.brandingLogo || null);
      if (user.useCalendlyBranding !== undefined) {
        setUseCalendlyBranding(user.useCalendlyBranding);
      }
    }
  };

  return (
    <div className="w-full pb-24">
      {/* Header — exact Calendly pattern */}
      <div className="mb-6 border-b border-[#E5E7EB] pb-5">
        <p className="text-[13px] text-[#006BFF] font-medium mb-1">Account details</p>
        <h1 className="text-[22px] font-bold text-[#1A1A1A] leading-tight">
          Branding
        </h1>
      </div>

      <div className="max-w-[520px]">
        {/* Logo Upload section */}
        <div className="mb-8">
          <label className="text-[14px] font-bold text-[#1A1A1A] mb-1.5 flex items-center gap-1.5">
            Logo
            <Info className="size-[14px] text-[#9CA3AF]" />
          </label>
          <p className="text-[14px] text-[#4D5562] mb-4">
            Your company branding will appear at the top-left corner of the scheduling page.
          </p>

          <label className="flex items-center gap-2 mb-5 cursor-pointer w-fit group">
            <input type="checkbox" className="size-4 rounded border-[#D1D5DB] text-[#006BFF] focus:ring-[#006BFF] cursor-pointer" />
            <span className="text-[14px] text-[#4D5562]">Apply to all users in your organization</span>
            <Info className="size-[14px] text-[#9CA3AF]" />
          </label>

          <div className="w-full h-[160px] border border-[#D1D5DB] rounded-lg bg-white flex items-center justify-center mb-4 overflow-hidden">
            {brandingLogo ? (
              <img src={brandingLogo} alt="Company Logo" className="object-contain max-h-[140px] max-w-full" />
            ) : (
              <span className="text-[16px] font-semibold text-[#9CA3AF]">No Logo</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <input 
              type="file" 
              accept="image/jpeg, image/png, image/gif" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white border border-[#D1D5DB] text-[#1A1A1A] text-[14px] font-semibold rounded-full hover:bg-[#F3F4F6] transition-colors"
            >
              Upload image
            </button>
            <p className="text-[13px] text-[#9CA3AF]">
              JPG, GIF or PNG. Max size of 5MB.
            </p>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-[#E5E7EB] my-6" />

        {/* Use Calendly branding toggle */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-[14px] font-bold text-[#1A1A1A]">
              Use Calendly branding
            </label>
            <button
              onClick={() => setUseCalendlyBranding(!useCalendlyBranding)}
              className={`relative w-[44px] h-[24px] rounded-full transition-colors duration-200 ${
                useCalendlyBranding ? "bg-[#006BFF]" : "bg-[#D1D5DB]"
              }`}
            >
              <div
                className={`absolute top-[2px] w-[20px] h-[20px] bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  useCalendlyBranding ? "right-[2px]" : "left-[2px]"
                }`}
              />
            </button>
          </div>

          {useCalendlyBranding && (
            <div className="p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-lg mb-5">
              <p className="text-[14px] text-[#1D4ED8]">
                Calendly&apos;s branding will be displayed on your scheduling page, notifications, and confirmations.
              </p>
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer w-fit group">
            <input type="checkbox" className="size-4 rounded border-[#D1D5DB] text-[#006BFF] focus:ring-[#006BFF] cursor-pointer" />
            <span className="text-[14px] text-[#4D5562]">Apply to all users in your organization</span>
            <Info className="size-[14px] text-[#9CA3AF]" />
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#006BFF] text-white text-[14px] font-bold rounded-full hover:bg-[#0055CC] transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="px-6 py-2.5 text-[#1A1A1A] bg-white border border-[#D1D5DB] text-[14px] font-bold rounded-full hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
