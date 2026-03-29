"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Info } from "lucide-react";

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: "",
    welcomeMessage: "",
    language: "English",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h (am/pm)",
    country: "India",
    timezone: "Asia/Kolkata",
  });
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        welcomeMessage: user.welcomeMessage || "",
        language: user.language || "English",
        dateFormat: user.dateFormat || "DD/MM/YYYY",
        timeFormat: user.timeFormat || "12h (am/pm)",
        country: user.country || "India",
        timezone: user.timezone || "Asia/Kolkata",
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
        dateFormat: user.dateFormat || "DD/MM/YYYY",
        timeFormat: user.timeFormat || "12h (am/pm)",
        country: user.country || "India",
        timezone: user.timezone || "Asia/Kolkata",
      });
    }
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  if (!user) return null;

  const selectClasses = "w-full h-[42px] text-[14px] px-3 bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:border-[#006BFF] focus:ring-2 focus:ring-[#006BFF]/20 transition-all appearance-none cursor-pointer text-[#1A1A1A] bg-[url('data:image/svg+xml;utf8,<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M4 6l4 4 4-4\" stroke=\"%236B7280\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>')] bg-no-repeat bg-[position:calc(100%-12px)_center]";

  return (
    <div className="w-full pb-24">
      {/* Header — Calendly exact pattern */}
      <div className="mb-6 border-b border-[#E5E7EB] pb-5">
        <p className="text-[13px] text-[#006BFF] font-medium mb-1">Account details</p>
        <h1 className="text-[22px] font-bold text-[#1A1A1A] leading-tight">
          Profile
        </h1>
      </div>

      <div className="max-w-[520px]">
        {/* Upload Picture */}
        <div className="flex items-center gap-5 mb-8">
          <Avatar className="size-[72px] bg-[#E1EAFF] shrink-0 border border-[#E5E7EB]">
            <AvatarImage src={user.avatarUrl || ""} alt="Avatar" />
            <AvatarFallback className="text-[#006BFF] text-[24px] font-semibold bg-[#E1EAFF]">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start gap-1.5">
            <button
              type="button"
              className="px-4 py-2 bg-white border border-[#D1D5DB] text-[#1A1A1A] text-[14px] font-semibold rounded-full hover:bg-[#F3F4F6] transition-colors"
              onClick={() => {
                alert("Upload profile picture connects to cloud storage.");
              }}
            >
              Upload picture
            </button>
            <p className="text-[#9CA3AF] text-[13px]">
              JPG, GIF or PNG. Max size of 5MB.
            </p>
          </div>
        </div>

        {/* Name */}
        <div className="mb-5">
          <label className="text-[14px] font-bold text-[#1A1A1A] mb-1.5 flex items-center gap-1.5">
            Name
            <Info className="size-[14px] text-[#9CA3AF]" />
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full h-[42px] text-[14px] px-3 bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:border-[#006BFF] focus:ring-2 focus:ring-[#006BFF]/20 transition-all text-[#1A1A1A]"
          />
        </div>

        {/* Welcome Message */}
        <div className="mb-5">
          <label className="text-[14px] font-bold text-[#1A1A1A] mb-1.5 flex items-center gap-1.5">
            Welcome Message
            <Info className="size-[14px] text-[#9CA3AF]" />
          </label>
          <textarea
            name="welcomeMessage"
            value={formData.welcomeMessage}
            onChange={handleChange}
            rows={3}
            className="w-full text-[14px] px-3 py-2.5 bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:border-[#006BFF] focus:ring-2 focus:ring-[#006BFF]/20 transition-all text-[#1A1A1A] resize-y"
            placeholder="Welcome to my scheduling page. Please follow the instructions to add an event to my calendar."
          />
        </div>

        {/* Language */}
        <div className="mb-5">
          <label className="text-[14px] font-bold text-[#1A1A1A] mb-1.5 block">
            Language
          </label>
          <select name="language" value={formData.language} onChange={handleChange} className={selectClasses}>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
        </div>

        {/* Date / Time Format Grid */}
        <div className="flex gap-4 mb-5">
          <div className="flex-1">
            <label className="text-[14px] font-bold text-[#1A1A1A] mb-1.5 flex items-center gap-1.5">
              Date Format
              <Info className="size-[14px] text-[#9CA3AF]" />
            </label>
            <select name="dateFormat" value={formData.dateFormat} onChange={handleChange} className={selectClasses}>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-[14px] font-bold text-[#1A1A1A] mb-1.5 flex items-center gap-1.5">
              Time Format
              <Info className="size-[14px] text-[#9CA3AF]" />
            </label>
            <select name="timeFormat" value={formData.timeFormat} onChange={handleChange} className={selectClasses}>
              <option value="12h (am/pm)">12h (am/pm)</option>
              <option value="24h">24h</option>
            </select>
          </div>
        </div>

        {/* Country */}
        <div className="mb-5">
          <label className="text-[14px] font-bold text-[#1A1A1A] mb-1.5 block">
            Country
          </label>
          <select name="country" value={formData.country} onChange={handleChange} className={selectClasses}>
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
            <option value="India">India</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
          </select>
        </div>

        {/* Time Zone */}
        <div className="mb-10">
          <div className="flex justify-between items-end mb-1.5">
            <label className="text-[14px] font-bold text-[#1A1A1A]">
              Time Zone
            </label>
            <span className="text-[13px] text-[#4D5562]">
              Current Time:{" "}
              <strong>
                {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()}
              </strong>
            </span>
          </div>
          <select name="timezone" value={formData.timezone} onChange={handleChange} className={selectClasses}>
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time - US & Canada</option>
            <option value="America/Chicago">Central Time - US & Canada</option>
            <option value="America/Denver">Mountain Time - US & Canada</option>
            <option value="America/Los_Angeles">Pacific Time - US & Canada</option>
            <option value="Europe/London">London</option>
            <option value="Europe/Paris">Central European Time</option>
            <option value="Asia/Kolkata">India Standard Time</option>
            <option value="Asia/Tokyo">Japan Standard Time</option>
            <option value="Australia/Sydney">Australian Eastern Time</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#006BFF] text-white text-[14px] font-bold rounded-full hover:bg-[#0055CC] transition-colors flex items-center justify-center min-w-[120px] disabled:opacity-50"
            >
              {isSaving ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Save Changes"
              )}
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 text-[#1A1A1A] bg-white border border-[#D1D5DB] text-[14px] font-bold rounded-full hover:bg-[#F3F4F6] transition-colors"
            >
              Cancel
            </button>
          </div>
          
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                alert("Connect this to the DELETE /api/users/me endpoint.");
              }
            }}
            className="px-6 py-2.5 bg-[#CC4B00] text-white text-[14px] font-bold rounded-full hover:bg-[#A33C00] transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
