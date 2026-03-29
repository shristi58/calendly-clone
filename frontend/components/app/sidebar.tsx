"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CalendlyLogo } from "@/components/shared/calendly-logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateEventTypeSheet } from "./create-event-type-sheet";
import {
  Link2,
  CalendarDays,
  Clock,
  Users,
  GitBranch,
  Puzzle,
  ArrowRightLeft,
  CircleDollarSign,
  BarChart,
  Shield,
  HelpCircle,
  ChevronsLeft,
  Zap,
  Globe
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Scheduling",
    href: "/app/scheduling/meeting_types/user/me",
    icon: Link2,
  },
  {
    label: "Meetings",
    href: "/app/scheduled_events/user/me",
    icon: CalendarDays,
  },
  {
    label: "Availability",
    href: "/app/availability/schedules",
    icon: Clock,
  },
  {
    label: "Contacts",
    href: "/app/contacts/user/me",
    icon: Users,
  },
  {
    label: "Workflows",
    href: "/app/workflows/user/me",
    icon: GitBranch,
  },
  {
    label: "Integrations & apps",
    href: "/integrations",
    icon: Puzzle,
  },
  {
    label: "Routing",
    href: "/app/routing/forms/user/me",
    icon: ArrowRightLeft,
  },
];

const BOTTOM_ITEMS = [
  {
    label: "Upgrade plan",
    href: "/upgrade",
    icon: CircleDollarSign,
    isButton: true,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart,
  },
  {
    label: "Admin center",
    href: "/admin",
    icon: Shield,
  },
  {
    label: "Help",
    href: "/help",
    icon: HelpCircle,
    hasDropdown: true,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [createSheetOpen, setCreateSheetOpen] = useState(false);

  const isActive = (href: string) => {
    if (pathname === href) return true;
    if (href.includes("/scheduling") && pathname.includes("/scheduling")) return true;
    if (href.includes("/scheduled_events") && pathname.includes("/scheduled_events")) return true;
    return false;
  };

  return (
    <>
      <aside className="w-[240px] h-screen flex flex-col bg-[#F9F9F9] border-r border-[#E5E5E5] shrink-0 font-sans">
        <div className="flex items-center justify-between px-5 h-[68px] shrink-0">
          <Link href="/app/scheduling/meeting_types/user/me">
            <CalendlyLogo size="md" />
          </Link>
          <button className="p-1 hover:bg-black/5 rounded-md text-[#666666] transition-colors">
            <ChevronsLeft className="size-5" />
          </button>
        </div>

        <div className="px-4 py-4 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="w-full h-10 rounded-full bg-[#006BFF] text-white hover:bg-[#005BE6] shadow-sm flex items-center justify-center gap-2 font-semibold transition-colors focus-visible:ring-1 focus-visible:ring-[#006BFF]"
                variant="default"
              >
                <span className="text-xl leading-none font-normal">+</span> Create
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[208px] p-2 rounded-xl shadow-lg border border-[#D9D9D9]">
              <DropdownMenuItem 
                onClick={() => setCreateSheetOpen(true)}
                className="flex flex-col items-start px-3 py-2 cursor-pointer rounded-md hover:bg-[#F2F2F2]"
              >
                <div className="flex items-center gap-3">
                  <Link2 className="w-4 h-4 text-[#006BFF]" />
                  <span className="font-semibold text-[#1A1A1A] text-sm">Event type</span>
                </div>
                <span className="text-xs text-[#666666] mt-0.5 ml-7">Create a new template for your regularly scheduled events.</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start px-3 py-2 cursor-pointer rounded-md hover:bg-[#F2F2F2] mt-1">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-[#006BFF]" />
                  <span className="font-semibold text-[#1A1A1A] text-sm">One-off meeting</span>
                </div>
                <span className="text-xs text-[#666666] mt-0.5 ml-7">Invite someone to pick a time to meet with you.</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start px-3 py-2 cursor-pointer rounded-md hover:bg-[#F2F2F2] mt-1">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-[#006BFF]" />
                  <span className="font-semibold text-[#1A1A1A] text-sm">Meeting poll</span>
                </div>
                <span className="text-xs text-[#666666] mt-0.5 ml-7">Schedule a group meeting by offering times to vote on.</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <nav className="flex-1 px-3 flex flex-col gap-[2px] overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-100 relative group",
                  active
                    ? "bg-[#E5F1FF] text-[#006BFF] font-semibold"
                    : "text-[#1A1A1A] font-medium hover:bg-[#EBEBEB]"
                )}
              >
                <item.icon
                  className={cn(
                    "size-5",
                    active ? "text-[#006BFF]" : "text-[#4D5055] group-hover:text-[#1A1A1A]"
                  )}
                  strokeWidth={1.75}
                />
                {item.label}
                
                {active && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#006BFF] rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

      {/* Bottom Section */}
      <div className="px-3 pb-6 pt-4 flex flex-col gap-1 shrink-0">
        {BOTTOM_ITEMS.map((item, idx) => {
          if (item.isButton) {
            return (
              <div key={item.label} className="px-1 py-2">
                <Link href={item.href}>
                  <Button
                    variant="outline"
                    className="w-full h-10 rounded-lg justify-start gap-3 border-[#D9D9D9] text-[#1A1A1A] hover:bg-[#EBEBEB] font-medium bg-transparent shadow-none"
                  >
                    <item.icon className="size-5 text-[#4D5055]" strokeWidth={1.75} />
                    {item.label}
                  </Button>
                </Link>
              </div>
            );
          }
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-[#1A1A1A] font-medium hover:bg-[#EBEBEB] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <item.icon className="size-5 text-[#4D5055] group-hover:text-[#1A1A1A]" strokeWidth={1.75} />
                {item.label}
              </div>
              {item.hasDropdown && (
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="text-[#1A1A1A]">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </Link>
          );
        })}
      </div>
    </aside>

    <CreateEventTypeSheet 
      open={createSheetOpen} 
      onOpenChange={setCreateSheetOpen} 
    />
    </>
  );
}
