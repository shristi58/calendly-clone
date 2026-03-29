"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { CalendlyLogo } from "@/components/shared/calendly-logo";
import {
  ChevronLeft,
  LayoutDashboard,
  Users,
  UsersRound,
  LogIn,
  DollarSign,
  Star,
  Globe,
  ShieldCheck,
  CalendarCheck
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] h-screen flex flex-col bg-white border-r border-[#E5E5E5] shrink-0 font-sans shadow-[2px_0_8px_-4px_rgba(0,0,0,0.05)]">
      {/* Header / Logo */}
      <div className="flex items-center px-6 h-[72px] shrink-0 border-b border-transparent">
        <Link href="/app/scheduling/meeting_types/user/me" className="flex items-center gap-2">
           <CalendlyLogo size="md" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        
        {/* Back Link */}
        <div>
          <Link 
            href="/app/scheduling/meeting_types/user/me" 
            className="flex items-center text-sm font-semibold text-[#006BFF] hover:underline px-2"
          >
            <ChevronLeft className="size-4 mr-1" strokeWidth={2.5} />
            Back to home
          </Link>
        </div>

        {/* Section: Main Title */}
        <div className="px-2">
          <h2 className="text-[17px] font-bold text-[#1A1A1A]">Admin center</h2>
        </div>

        {/* Navigation items */}
        <nav className="flex flex-col gap-0.5">
          <Link
            href="/app/admin/dashboard"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-semibold transition-colors",
              pathname === "/app/admin/dashboard" 
                ? "bg-[#E5F1FF] text-[#006BFF]" 
                : "text-[#1A1A1A] hover:bg-[#F2F2F2]"
            )}
          >
            <div className="w-5 flex justify-center">
              <LayoutDashboard className="size-[18px]" strokeWidth={2} />
            </div>
            Dashboard
          </Link>

          {/* Section: People */}
          <div className="mt-6 mb-2 px-3">
            <h3 className="text-xs font-semibold text-[#808080] uppercase tracking-wider">People</h3>
          </div>
          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-semibold text-[#1A1A1A] hover:bg-[#F2F2F2] transition-colors">
            <div className="w-5 flex justify-center"><Users className="size-[18px]" strokeWidth={2} /></div>
            Users
          </Link>
          <Link href="/admin/groups" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-semibold text-[#1A1A1A] hover:bg-[#F2F2F2] transition-colors">
            <div className="w-5 flex justify-center"><UsersRound className="size-[18px]" strokeWidth={2} /></div>
            Groups
          </Link>

          {/* Section: Organization */}
          <div className="mt-6 mb-2 px-3">
            <h3 className="text-xs font-semibold text-[#808080] uppercase tracking-wider">Organization</h3>
          </div>
          <Link href="/admin/login" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-semibold text-[#1A1A1A] hover:bg-[#F2F2F2] transition-colors">
            <div className="w-5 flex justify-center"><LogIn className="size-[18px]" strokeWidth={2} /></div>
            Login
          </Link>
          <Link href="/admin/billing" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-semibold text-[#1A1A1A] hover:bg-[#F2F2F2] transition-colors">
            <div className="w-5 flex justify-center"><DollarSign className="size-[18px]" strokeWidth={2} /></div>
            Billing
          </Link>
          <Link href="/admin/branding" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-semibold text-[#1A1A1A] hover:bg-[#F2F2F2] transition-colors">
            <div className="w-5 flex justify-center"><Star className="size-[18px]" strokeWidth={2} /></div>
            Branding
          </Link>
          <Link href="/admin/permissions" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-semibold text-[#1A1A1A] hover:bg-[#F2F2F2] transition-colors">
            <div className="w-5 flex justify-center"><Globe className="size-[18px]" strokeWidth={2} /></div>
            Permissions
          </Link>
          <Link href="/admin/security" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-semibold text-[#1A1A1A] hover:bg-[#F2F2F2] transition-colors">
            <div className="w-5 flex justify-center"><ShieldCheck className="size-[18px]" strokeWidth={2} /></div>
            Security
          </Link>

          {/* Section: Templates */}
          <div className="mt-6 mb-2 px-3">
            <h3 className="text-xs font-semibold text-[#808080] uppercase tracking-wider">Templates</h3>
          </div>
          <Link href="/admin/managed-events" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-semibold text-[#1A1A1A] hover:bg-[#F2F2F2] transition-colors">
            <div className="w-5 flex justify-center"><CalendarCheck className="size-[18px]" strokeWidth={2} /></div>
            Managed events
          </Link>
        </nav>
      </div>
    </aside>
  );
}
