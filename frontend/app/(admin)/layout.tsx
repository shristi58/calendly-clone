"use client";

import { useAuth } from "@/hooks/use-auth";
import { AdminSidebar } from "@/components/app/admin-sidebar";
import { TopNav } from "@/components/app/top-nav";
import { GlobalLoader } from "@/components/shared/global-loader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isInitialized, isAuthenticated } = useAuth({ redirectTo: "/login" });

  if (!isInitialized || !isAuthenticated) {
    return <GlobalLoader />;
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden text-[#1A1A1A] font-sans selection:bg-[#006BFF] selection:text-white">
      <AdminSidebar />
      <main className="flex-1 flex flex-col h-full bg-white relative">
        <TopNav />
        <div className="flex-1 overflow-y-auto px-10 py-8 scrollbar-hide">
          <div className="max-w-[1240px] mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
