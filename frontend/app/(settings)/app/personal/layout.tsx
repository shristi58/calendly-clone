"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/stores/auth-store";
import { GlobalLoader } from "@/components/shared/global-loader";
import {
  User,
  Star,
  Link as LinkIcon,
  Globe,
  ListFilter,
  Lock,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  UserPlus,
  ChevronDown,
} from "lucide-react";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isInitialized, isAuthenticated, user } = useAuth({ redirectTo: "/login" });
  const { logout } = useAuthStore();

  if (!isInitialized || !isAuthenticated) {
    return <GlobalLoader />;
  }

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const accountLinks = [
    { name: "Profile", href: "/app/personal/profile", icon: User },
    { name: "Branding", href: "/app/personal/branding", icon: Star },
    { name: "My Link", href: "/app/personal/link", icon: LinkIcon },
  ];

  const settingsLinks = [
    { name: "Communication settings", href: "/app/personal/workflows", icon: Globe },
    { name: "Login preferences", href: "/app/personal/login_preferences", icon: ListFilter },
    { name: "Security", href: "/app/personal/security", icon: Lock },
    { name: "Cookie settings", href: "/app/personal/cookie_settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F2F4F8] text-[#1A1A1A] font-sans selection:bg-[#006BFF] selection:text-white">
      {/* Top Header — matches Calendly exactly */}
      <header className="h-[56px] bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          {/* Calendly Logo */}
          <Link href="/app" className="flex items-center gap-2">
            <svg width="120" height="28" viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="14" cy="14" r="12" stroke="#006BFF" strokeWidth="2.5" fill="none" />
              <circle cx="14" cy="14" r="5" fill="#006BFF" />
              <text x="34" y="20" fontFamily="system-ui, -apple-system, sans-serif" fontSize="18" fontWeight="700" fill="#006BFF">Calendly</text>
            </svg>
          </Link>
        </div>

        {/* Right side — invite + avatar */}
        <div className="flex items-center gap-3">
          <button className="p-2 text-[#4D5562] hover:text-[#1A1A1A] hover:bg-[#F2F4F8] rounded-lg transition-colors">
            <UserPlus className="size-5" strokeWidth={1.5} />
          </button>
          <button className="flex items-center gap-1.5 pl-1 pr-0.5 py-0.5 hover:bg-[#F2F4F8] rounded-lg transition-colors">
            <div className="size-8 rounded-full bg-[#E1EAFF] flex items-center justify-center text-[#006BFF] text-sm font-semibold">
              {user ? getInitials(user.name) : "?"}
            </div>
            <ChevronDown className="size-4 text-[#4D5562]" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 w-full">
        
        {/* Sidebar — exact match to Calendly */}
        <aside className="w-[240px] shrink-0 bg-white border-r border-[#E5E7EB] hidden md:flex flex-col justify-between py-5 px-3">
          <div>
            {/* Back to home */}
            <Link
              href="/app"
              className="flex items-center gap-1 text-[#006BFF] text-[14px] font-medium hover:text-[#0055CC] transition-colors mb-5 px-2"
            >
              <ChevronLeft className="size-4" strokeWidth={2} />
              Back to home
            </Link>

            {/* Account settings heading */}
            <h1 className="text-[16px] font-bold text-[#1A1A1A] mb-4 px-2">
              Account settings
            </h1>

            {/* Account section */}
            <p className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-1.5 px-3">
              Account
            </p>

            <nav className="flex flex-col gap-0.5 mb-3">
              {accountLinks.map((link) => {
                const isActive = pathname === link.href;
                const IconComp = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[14px] transition-all duration-150 ${
                      isActive
                        ? "font-semibold bg-[#E1EAFF] text-[#006BFF]"
                        : "text-[#4D5562] hover:bg-[#F3F4F6] font-medium"
                    }`}
                  >
                    <IconComp className="size-[18px]" strokeWidth={isActive ? 2 : 1.5} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Settings links */}
            <nav className="flex flex-col gap-0.5">
              {settingsLinks.map((link) => {
                const isActive = pathname === link.href;
                const IconComp = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[14px] transition-all duration-150 ${
                      isActive
                        ? "font-semibold bg-[#E1EAFF] text-[#006BFF]"
                        : "text-[#4D5562] hover:bg-[#F3F4F6] font-medium"
                    }`}
                  >
                    <IconComp className="size-[18px]" strokeWidth={isActive ? 2 : 1.5} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom: Help + Logout */}
          <div className="flex flex-col gap-0.5 border-t border-[#E5E7EB] pt-3 mt-3">
            <button
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[14px] text-[#4D5562] hover:bg-[#F3F4F6] font-medium transition-colors w-full text-left"
            >
              <HelpCircle className="size-[18px]" strokeWidth={1.5} />
              Help
              <ChevronDown className="size-3.5 ml-auto" strokeWidth={1.5} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[14px] text-[#4D5562] hover:bg-[#F3F4F6] font-medium transition-colors w-full text-left"
            >
              <LogOut className="size-[18px]" strokeWidth={1.5} />
              Logout
            </button>
          </div>
        </aside>

        {/* Page Content */}
        <main className="flex-1 bg-[#F2F4F8] py-8 px-6 sm:px-10 overflow-auto">
          <div className="max-w-[700px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
