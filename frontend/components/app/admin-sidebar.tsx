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
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-semibold transition-colors relative",
              pathname === "/app/admin/dashboard" 
                ? "bg-[#E5F1FF] text-[#006BFF]" 
                : "text-[#1A1A1A] hover:bg-[#F2F2F2]"
            )}
          >
            <div className="w-5 flex justify-center shrink-0">
              <LayoutDashboard className="size-[18px]" strokeWidth={2} />
            </div>
            <span className="truncate">Dashboard</span>
            {pathname === "/app/admin/dashboard" && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#006BFF] rounded-r-full" />
            )}
          </Link>

          {/* Section: People */}
          <div className="mt-6 mb-2 px-3">
            <h3 className="text-xs font-semibold text-[#808080] uppercase tracking-wider">People</h3>
          </div>
          {[
            { href: "/admin/users", icon: Users, label: "Users" },
            { href: "/admin/groups", icon: UsersRound, label: "Groups" },
          ].map((item) => (
             <Link key={item.label} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-semibold text-[#1A1A1A] hover:bg-[#F2F2F2] transition-colors group">
                <div className="w-5 flex justify-center shrink-0"><item.icon className="size-[18px] text-[#4D5055] group-hover:text-[#1A1A1A]" strokeWidth={2} /></div>
                <span className="truncate">{item.label}</span>
                <span className="ml-auto text-[10px] font-bold text-[#808080] bg-[#EDEDED] px-1.5 py-0.5 rounded-[4px] leading-tight shrink-0 uppercase tracking-tight">Soon</span>
             </Link>
          ))}

          {/* Section: Organization */}
          <div className="mt-6 mb-2 px-3">
            <h3 className="text-xs font-semibold text-[#808080] uppercase tracking-wider">Organization</h3>
          </div>
          {[
            { href: "/admin/login", icon: LogIn, label: "Login" },
            { href: "/admin/billing", icon: DollarSign, label: "Billing" },
            { href: "/admin/branding", icon: Star, label: "Branding" },
            { href: "/admin/permissions", icon: Globe, label: "Permissions" },
            { href: "/admin/security", icon: ShieldCheck, label: "Security" },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-semibold text-[#1A1A1A] hover:bg-[#F2F2F2] transition-colors group">
              <div className="w-5 flex justify-center shrink-0"><item.icon className="size-[18px] text-[#4D5055] group-hover:text-[#1A1A1A]" strokeWidth={2} /></div>
              <span className="truncate">{item.label}</span>
              <span className="ml-auto text-[10px] font-bold text-[#808080] bg-[#EDEDED] px-1.5 py-0.5 rounded-[4px] leading-tight shrink-0 uppercase tracking-tight">Soon</span>
            </Link>
          ))}

          {/* Section: Templates */}
          <div className="mt-6 mb-2 px-3">
            <h3 className="text-xs font-semibold text-[#808080] uppercase tracking-wider">Templates</h3>
          </div>
          <Link href="/admin/managed-events" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-semibold text-[#1A1A1A] hover:bg-[#F2F2F2] transition-colors group">
            <div className="w-5 flex justify-center shrink-0"><CalendarCheck className="size-[18px] text-[#4D5055] group-hover:text-[#1A1A1A]" strokeWidth={2} /></div>
            <span className="truncate">Managed events</span>
            <span className="ml-auto text-[10px] font-bold text-[#808080] bg-[#EDEDED] px-1.5 py-0.5 rounded-[4px] leading-tight shrink-0 uppercase tracking-tight">Soon</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
}
