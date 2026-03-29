import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md w-full flex flex-col items-center">
        {/* Playful placeholder graphic */}
        <div className="relative w-48 h-48 mb-8">
          <div className="absolute inset-0 bg-[#E5F1FF] rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute inset-4 bg-[#F0F7FF] rounded-full shadow-inner flex items-center justify-center">
             <Search className="w-16 h-16 text-[#006BFF] opacity-50" />
          </div>
        </div>

        <h1 className="text-8xl font-black text-[#1A1A1A] tracking-tighter mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-3">
          Looks like this page is missing.
        </h2>
        
        <p className="text-[#666666] text-lg mb-8 max-w-sm">
          We can't seem to find the page you're looking for. It might have been removed, or the link may be broken.
        </p>

        <div className="flex gap-4 items-center justify-center">
          <Link href="/app/scheduling/meeting_types/user/me">
            <Button 
              className="bg-[#006BFF] hover:bg-[#005BE6] text-white rounded-full px-8 py-6 text-base font-semibold shadow-sm transition-all hover:shadow-md"
            >
              Back to dashboard
            </Button>
          </Link>
          <Link href="/help">
            <Button 
              variant="outline"
              className="border-[#CCCCCC] text-[#1A1A1A] hover:bg-[#F2F2F2] rounded-full px-8 py-6 text-base font-semibold shadow-sm"
            >
              Visit Help Center
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="mt-16 text-sm text-[#666666]">
        &copy; {new Date().getFullYear()} Calendly Clone
      </div>
    </div>
  );
}
