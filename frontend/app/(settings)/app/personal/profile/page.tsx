"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  
  // Local state for the form
  const [formData, setFormData] = useState({
    name: "",
    welcomeMessage: "",
    language: "English",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    country: "United States",
  });
  
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        welcomeMessage: user.welcomeMessage || "",
        language: user.language || "English",
        dateFormat: user.dateFormat || "MM/DD/YYYY",
        timeFormat: user.timeFormat || "12h",
        country: user.country || "United States",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await updateProfile(formData);
    setIsSaving(false);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        welcomeMessage: user.welcomeMessage || "",
        language: user.language || "English",
        dateFormat: user.dateFormat || "MM/DD/YYYY",
        timeFormat: user.timeFormat || "12h",
        country: user.country || "United States",
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) return null;

  return (
    <div className="max-w-[800px] w-full pb-24">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-[28px] font-bold text-[#1A1A1A] leading-tight">
            Profile
          </h1>
        </div>
      </div>

      <div className="border border-[#EBEBEB] rounded-lg bg-white overflow-hidden shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]">
        {/* Upload Picture section */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start border-b border-[#EBEBEB]">
          <div className="w-[180px] shrink-0 font-bold text-[15px] pt-1 text-[#1A1A1A]">
            Profile Picture
          </div>
          <div className="flex flex-col sm:flex-row gap-6 items-center w-full">
            <Avatar className="size-[100px] shadow-sm shrink-0 border border-[#EBEBEB]">
              <AvatarImage src={user.avatarUrl || ""} alt="Avatar" />
              <AvatarFallback className="bg-[#E5F1FF] text-[#006BFF] text-[2rem] font-medium">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-white border border-[#006BFF] text-[#006BFF] text-sm font-bold rounded-full hover:bg-[#F0F6FF] transition-all min-w-[140px]"
                  onClick={() => {
                    /* Stub for upload */
                    alert("This connects to an S3/Cloudinary uploader.");
                  }}
                >
                  Update
                </button>
                {user.avatarUrl && (
                  <button
                    type="button"
                    className="px-4 py-2 bg-white border border-[#EBEBEB] text-[#666666] text-sm font-bold rounded-full hover:bg-[#F2F2F2] transition-all min-w-[100px]"
                    onClick={() => updateProfile({ avatarUrl: null })}
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-[#666666] text-[15px]">
                JPG, GIF or PNG. Max size of 5MB.
              </p>
            </div>
          </div>
        </div>

        {/* Name section */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start border-b border-[#EBEBEB]">
          <div className="w-[180px] shrink-0 font-bold text-[15px] pt-3 text-[#1A1A1A]">
            Name
          </div>
          <div className="flex-1 w-full">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full text-[15px] px-3 py-3 border border-[#CCCCCC] rounded-lg focus:outline-none focus:border-[#006BFF] focus:ring-1 focus:ring-[#006BFF] transition-all"
            />
          </div>
        </div>

        {/* Welcome Message section */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start border-b border-[#EBEBEB]">
          <div className="w-[180px] shrink-0 font-bold text-[15px] pt-3 text-[#1A1A1A]">
            Welcome Message
          </div>
          <div className="flex-1 w-full">
            <textarea
              name="welcomeMessage"
              value={formData.welcomeMessage}
              onChange={handleChange}
              rows={4}
              className="w-full text-[15px] px-3 py-3 border border-[#CCCCCC] rounded-lg focus:outline-none focus:border-[#006BFF] focus:ring-1 focus:ring-[#006BFF] transition-all"
              placeholder=""
            />
          </div>
        </div>

        {/* Language section */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start border-b border-[#EBEBEB]">
          <div className="w-[180px] shrink-0 font-bold text-[15px] pt-3 text-[#1A1A1A]">
            Language
          </div>
          <div className="flex-1 w-full max-w-[320px]">
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full text-[15px] px-3 py-3 border border-[#CCCCCC] rounded-lg focus:outline-none focus:border-[#006BFF] focus:ring-1 focus:ring-[#006BFF] transition-all appearance-none bg-no-repeat bg-[url('data:image/svg+xml;utf8,<svg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22><path d=%22M5 7.5L10 12.5L15 7.5%22 stroke=%22%23666666%22 stroke-width=%221.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-[position:calc(100%-12px)_center]"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
        </div>

        {/* Date Format section */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start border-b border-[#EBEBEB]">
          <div className="w-[180px] shrink-0 font-bold text-[15px] pt-3 text-[#1A1A1A]">
            Date Format
          </div>
          <div className="flex-1 w-full max-w-[320px]">
            <select
              name="dateFormat"
              value={formData.dateFormat}
              onChange={handleChange}
              className="w-full text-[15px] px-3 py-3 border border-[#CCCCCC] rounded-lg focus:outline-none focus:border-[#006BFF] focus:ring-1 focus:ring-[#006BFF] transition-all appearance-none bg-no-repeat bg-[url('data:image/svg+xml;utf8,<svg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22><path d=%22M5 7.5L10 12.5L15 7.5%22 stroke=%22%23666666%22 stroke-width=%221.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-[position:calc(100%-12px)_center]"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>

        {/* Time Format section */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start border-b border-[#EBEBEB]">
          <div className="w-[180px] shrink-0 font-bold text-[15px] pt-3 text-[#1A1A1A]">
            Time Format
          </div>
          <div className="flex-1 w-full max-w-[320px]">
            <select
              name="timeFormat"
              value={formData.timeFormat}
              onChange={handleChange}
              className="w-full text-[15px] px-3 py-3 border border-[#CCCCCC] rounded-lg focus:outline-none focus:border-[#006BFF] focus:ring-1 focus:ring-[#006BFF] transition-all appearance-none bg-no-repeat bg-[url('data:image/svg+xml;utf8,<svg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22><path d=%22M5 7.5L10 12.5L15 7.5%22 stroke=%22%23666666%22 stroke-width=%221.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-[position:calc(100%-12px)_center]"
            >
              <option value="12h">12h (am/pm)</option>
              <option value="24h">24h</option>
            </select>
          </div>
        </div>

        {/* Country section */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-[180px] shrink-0 font-bold text-[15px] pt-3 text-[#1A1A1A]">
            Country
          </div>
          <div className="flex-1 w-full max-w-[320px]">
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full text-[15px] px-3 py-3 border border-[#CCCCCC] rounded-lg focus:outline-none focus:border-[#006BFF] focus:ring-1 focus:ring-[#006BFF] transition-all appearance-none bg-no-repeat bg-[url('data:image/svg+xml;utf8,<svg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 fill=%22none%22 xmlns=%22http://www.w3.org/2000/svg%22><path d=%22M5 7.5L10 12.5L15 7.5%22 stroke=%22%23666666%22 stroke-width=%221.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-[position:calc(100%-12px)_center]"
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="India">India</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-[#EBEBEB] bg-white p-4 z-20 flex justify-end gap-3 px-8 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
        <button
          onClick={handleCancel}
          className="px-5 py-2.5 text-[#1A1A1A] text-sm font-bold rounded-full hover:bg-[#F2F2F2] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 bg-[#006BFF] text-white text-sm font-bold rounded-full hover:bg-[#005BE6] transition-colors flex items-center justify-center min-w-[130px]"
        >
          {isSaving ? (
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
}
