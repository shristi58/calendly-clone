"use client";

import { useAuthStore } from "@/stores/auth-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserPlus, User, Star, Link, Settings, BookOpen, MessageSquare, ExternalLink, LogOut } from "lucide-react";

export function TopNav() {
  const { user, logout } = useAuthStore();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="h-[68px] flex items-center justify-end px-8 shrink-0">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-black/5 rounded-full transition-colors text-[#666666]">
          <UserPlus className="size-5" />
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 focus:outline-none">
              <Avatar className="size-9 ring-1 ring-[#D9D9D9] hover:ring-[#006BFF] transition-all">
                <AvatarFallback className="bg-white text-[#1A1A1A] font-medium text-sm">
                  {user ? getInitials(user.name) : "A"}
                </AvatarFallback>
              </Avatar>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="text-[#666666] ml-1">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px] border-[#D9D9D9] rounded-xl shadow-lg p-0 py-2">
            <div className="px-5 py-3 flex flex-col gap-1">
              <div className="font-semibold text-lg text-[#1A1A1A]">
                {user?.name || "Loading..."}
              </div>
              <div className="text-sm text-[#006BFF] font-medium flex items-center gap-1 cursor-pointer">
                Teams free trial <span className="underline">Upgrade</span>
              </div>
              <div className="mt-2 bg-[#E5F1FF] text-[#1A1A1A] text-xs font-semibold px-2.5 py-1 rounded w-fit">
                14 days left
              </div>
            </div>

            <DropdownMenuSeparator className="bg-[#EBEBEB]" />

            <div className="py-2">
              <DropdownMenuLabel className="px-5 text-xs text-[#666666] font-semibold uppercase tracking-wider mb-1">
                Account settings
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem className="px-5 py-2.5 hover:bg-[#F2F2F2] cursor-pointer text-[#1A1A1A] font-medium">
                  <User className="mr-3 size-[18px]" strokeWidth={2} />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="px-5 py-2.5 hover:bg-[#F2F2F2] cursor-pointer text-[#1A1A1A] font-medium">
                  <Star className="mr-3 size-[18px]" strokeWidth={2} />
                  Branding
                </DropdownMenuItem>
                <DropdownMenuItem className="px-5 py-2.5 hover:bg-[#F2F2F2] cursor-pointer text-[#1A1A1A] font-medium">
                  <Link className="mr-3 size-[18px]" strokeWidth={2} />
                  My Link
                </DropdownMenuItem>
                <DropdownMenuItem className="px-5 py-2.5 hover:bg-[#F2F2F2] cursor-pointer text-[#1A1A1A] font-medium">
                  <Settings className="mr-3 size-[18px]" strokeWidth={2} />
                  All settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </div>

            <DropdownMenuSeparator className="bg-[#EBEBEB]" />

            <div className="py-2">
              <DropdownMenuLabel className="px-5 text-xs text-[#666666] font-semibold uppercase tracking-wider mb-1">
                Resources
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem className="px-5 py-2.5 hover:bg-[#F2F2F2] cursor-pointer text-[#1A1A1A] font-medium">
                  <BookOpen className="mr-3 size-[18px]" strokeWidth={2} />
                  Getting started guide
                </DropdownMenuItem>
                <DropdownMenuItem className="px-5 py-2.5 hover:bg-[#F2F2F2] cursor-pointer text-[#1A1A1A] font-medium">
                  <MessageSquare className="mr-3 size-[18px]" strokeWidth={2} />
                  Community
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </div>

            <DropdownMenuSeparator className="bg-[#EBEBEB]" />

            <div className="py-2">
              <DropdownMenuItem className="px-5 py-2.5 hover:bg-[#F2F2F2] cursor-pointer text-[#1A1A1A] font-medium">
                <ExternalLink className="mr-3 size-[18px]" strokeWidth={2} />
                Visit calendly.com
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={logout}
                className="px-5 py-2.5 hover:bg-[#F2F2F2] cursor-pointer text-[#1A1A1A] font-medium"
              >
                <LogOut className="mr-3 size-[18px]" strokeWidth={2} />
                Logout
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
