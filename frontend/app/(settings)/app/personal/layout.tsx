"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/stores/auth-store";
import { GlobalLoader } from "@/components/shared/global-loader";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isInitialized, isAuthenticated, user } = useAuth({ redirectTo: "/login" });
  const { logout } = useAuthStore();

  if (!isInitialized || !isAuthenticated) {
    return <GlobalLoader />;
  }

  const accountLinks = [
    { name: "Profile", href: "/app/personal/profile" },
    { name: "Branding", href: "/app/personal/branding" },
    { name: "My Link", href: "/app/personal/my_link" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#1A1A1A] font-sans selection:bg-[#006BFF] selection:text-white">
      {/* Top Header */}
      <header className="h-[68px] border-b border-[#EBEBEB] flex items-center px-4 sm:px-8 bg-white shrink-0 sticky top-0 z-10 w-full">
        <div className="flex items-center gap-6">
          <Link href="/app" className="flex items-center gap-2">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="2" y="2" width="28" height="28" rx="8" fill="#006BFF" />
              <path
                d="M21.5 12C21.5 10.6193 20.3807 9.5 19 9.5C17.6193 9.5 16.5 10.6193 16.5 12C16.5 13.3807 17.6193 14.5 19 14.5C20.3807 14.5 21.5 13.3807 21.5 12Z"
                fill="white"
              />
              <path
                d="M16 16C16 14.6193 14.8807 13.5 13.5 13.5C12.1193 13.5 11 14.6193 11 16C11 17.3807 12.1193 18.5 13.5 18.5C14.8807 18.5 16 17.3807 16 16Z"
                fill="white"
              />
              <path
                d="M19 16C19 14.6193 17.8807 13.5 16.5 13.5C15.1193 13.5 14 14.6193 14 16C14 17.3807 15.1193 18.5 16.5 18.5C17.8807 18.5 19 17.3807 19 16Z"
                fill="white"
              />
              <path
                d="M16 20C16 18.6193 14.8807 17.5 13.5 17.5C12.1193 17.5 11 18.6193 11 20C11 21.3807 12.1193 22.5 13.5 22.5C14.8807 22.5 16 21.3807 16 20Z"
                fill="white"
              />
              <path
                d="M19 20C19 18.6193 17.8807 17.5 16.5 17.5C15.1193 17.5 14 18.6193 14 20C14 21.3807 15.1193 22.5 16.5 22.5C17.8807 22.5 19 21.3807 19 20Z"
                fill="white"
              />
              <path
                d="M13.5 9.5C12.1193 9.5 11 10.6193 11 12C11 13.3807 12.1193 14.5 13.5 14.5C14.8807 14.5 16 13.3807 16 12C16 10.6193 14.8807 9.5 13.5 9.5Z"
                fill="white"
              />
            </svg>
          </Link>
          <div className="h-4 w-px bg-[#EBEBEB]"></div>
          <Link
            href="/app"
            className="text-[#006BFF] text-[15px] font-medium hover:text-[#005BE6] transition-colors flex items-center gap-1.5"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to home
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 max-w-[1240px] w-full mx-auto animate-in fade-in duration-500">
        
        {/* Sidebar */}
        <aside className="w-[280px] shrink-0 p-8 hidden md:block">
          <h1 className="text-[22px] font-bold text-[#1A1A1A] mb-6">
            Account settings
          </h1>
          
          <nav className="flex flex-col gap-1">
            <div className="mb-4">
              <h2 className="text-[13px] font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 px-3">
                Account
              </h2>
              <ul className="flex flex-col">
                {accountLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className={`block px-3 py-2 rounded-md text-[15px] transition-colors ${
                          isActive
                            ? "font-medium bg-[#E5F1FF] text-[#006BFF]"
                            : "text-[#1A1A1A] hover:bg-[#F2F2F2]"
                        }`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            
            <Link href="#" className="px-3 py-2 text-[15px] text-[#1A1A1A] hover:bg-[#F2F2F2] rounded-md transition-colors block">
              Communication settings
            </Link>
            <Link href="#" className="px-3 py-2 text-[15px] text-[#1A1A1A] hover:bg-[#F2F2F2] rounded-md transition-colors block">
              Login preferences
            </Link>
            <Link href="#" className="px-3 py-2 text-[15px] text-[#1A1A1A] hover:bg-[#F2F2F2] rounded-md transition-colors block">
              Security
            </Link>
            <Link href="#" className="px-3 py-2 text-[15px] text-[#1A1A1A] hover:bg-[#F2F2F2] rounded-md transition-colors block">
              Cookie settings
            </Link>
            
            <div className="my-2 border-t border-[#EBEBEB]"></div>
            
            <Link href="#" className="px-3 py-2 text-[15px] text-[#1A1A1A] hover:bg-[#F2F2F2] rounded-md transition-colors block">
              Help
            </Link>
            <button 
              onClick={logout}
              className="w-full text-left px-3 py-2 text-[15px] text-[#1A1A1A] hover:bg-[#F2F2F2] rounded-md transition-colors block"
            >
              Logout
            </button>
          </nav>
        </aside>

        {/* Page Content */}
        <main className="flex-1 py-8 px-4 sm:px-8 max-w-[800px] w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
