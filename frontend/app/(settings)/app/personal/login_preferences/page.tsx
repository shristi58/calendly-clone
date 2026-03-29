"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useState } from "react";
import { toast } from "sonner";

const GoogleIcon = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const MicrosoftIcon = ({ size = 24 }: { size?: number }) => (
  <svg viewBox="0 0 21 21" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
    <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
    <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
    <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
  </svg>
);

export default function LoginPreferencesPage() {
  const { user, unlinkOAuthProvider } = useAuthStore();
  const currentEmail = user?.email || "";
  const [unlinking, setUnlinking] = useState<string | null>(null);

  const oauthAccounts = user?.oauthAccounts || [];
  const hasGoogle = oauthAccounts.some((acc) => acc.provider === "google");
  const hasMicrosoft = oauthAccounts.some((acc) => acc.provider === "microsoft");

  const handleUnlink = async (provider: string) => {
    setUnlinking(provider);
    try {
      await unlinkOAuthProvider(provider);
    } catch {
      // Error handled by store toast
    } finally {
      setUnlinking(null);
    }
  };

  const handleSwitchProvider = (provider: string) => {
    window.location.href = `/api/auth/link/${provider}`;
  };

  return (
    <div className="w-full pb-24">
      {/* Header */}
      <div className="mb-6 border-b border-[#E5E7EB] pb-5">
        <p className="text-[13px] text-[#006BFF] font-medium mb-1">Account details</p>
        <h1 className="text-[22px] font-bold text-[#1A1A1A] leading-tight">
          Login preferences
        </h1>
      </div>

      <div className="max-w-[520px]">
        {/* === Google Connected === */}
        {hasGoogle && (
          <>
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <GoogleIcon size={28} />
                <span className="text-[14px] text-[#1A1A1A]">
                  You log in with a Google account.
                </span>
              </div>
              <button
                onClick={() => handleUnlink("google")}
                disabled={unlinking === "google"}
                className="px-4 py-1.5 bg-white border border-[#D1D5DB] text-[#1A1A1A] text-[14px] font-semibold rounded-full hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
              >
                {unlinking === "google" ? "Unlinking..." : "Unlink"}
              </button>
            </div>

            {/* Google account email */}
            <div className="flex items-center justify-between py-4 border-b border-[#E5E7EB]">
              <div>
                <p className="text-[14px] font-bold text-[#1A1A1A]">Google account</p>
                <p className="text-[14px] text-[#4D5562]">{currentEmail}</p>
              </div>
              <button
                onClick={() => toast.info("Change email feature coming soon")}
                className="px-4 py-1.5 bg-white border border-[#D1D5DB] text-[#1A1A1A] text-[14px] font-semibold rounded-full hover:bg-[#F3F4F6] transition-colors"
              >
                Change email
              </button>
            </div>
          </>
        )}

        {/* === Microsoft Connected === */}
        {hasMicrosoft && (
          <>
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <MicrosoftIcon size={28} />
                <span className="text-[14px] text-[#1A1A1A]">
                  You log in with a Microsoft account.
                </span>
              </div>
              <button
                onClick={() => handleUnlink("microsoft")}
                disabled={unlinking === "microsoft"}
                className="px-4 py-1.5 bg-white border border-[#D1D5DB] text-[#1A1A1A] text-[14px] font-semibold rounded-full hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
              >
                {unlinking === "microsoft" ? "Unlinking..." : "Unlink"}
              </button>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-[#E5E7EB]">
              <div>
                <p className="text-[14px] font-bold text-[#1A1A1A]">Microsoft account</p>
                <p className="text-[14px] text-[#4D5562]">{currentEmail}</p>
              </div>
              <button
                onClick={() => toast.info("Change email feature coming soon")}
                className="px-4 py-1.5 bg-white border border-[#D1D5DB] text-[#1A1A1A] text-[14px] font-semibold rounded-full hover:bg-[#F3F4F6] transition-colors"
              >
                Change email
              </button>
            </div>
          </>
        )}

        {/* === Switch to Provider buttons === */}
        <div className="py-6">
          {!hasMicrosoft && (
            <button
              onClick={() => handleSwitchProvider("microsoft")}
              className="flex items-center gap-3 px-5 py-2.5 bg-white border border-[#D1D5DB] text-[#1A1A1A] text-[14px] font-semibold rounded-full hover:bg-[#F3F4F6] transition-colors mb-3"
            >
              <MicrosoftIcon size={20} />
              Switch to Microsoft login
            </button>
          )}
          {!hasGoogle && (
            <button
              onClick={() => handleSwitchProvider("google")}
              className="flex items-center gap-3 px-5 py-2.5 bg-white border border-[#D1D5DB] text-[#1A1A1A] text-[14px] font-semibold rounded-full hover:bg-[#F3F4F6] transition-colors mb-3"
            >
              <GoogleIcon size={20} />
              Switch to Google login
            </button>
          )}
        </div>

        {/* Help text */}
        <p className="text-[14px] text-[#6B7280]">
          Please{" "}
          <a href="#" className="text-[#006BFF] hover:underline">
            contact support
          </a>{" "}
          if you need assistance.
        </p>
      </div>
    </div>
  );
}
