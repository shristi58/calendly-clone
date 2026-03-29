import Link from "next/link";
import { CalendlyLogo } from "@/components/shared/calendly-logo";

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-0">
            <CalendlyLogo size="md" />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {["Product", "Solutions", "Enterprise", "Pricing", "Resources"].map((item) => (
              <button
                key={item}
                className="text-[15px] font-medium text-[#0B3558] hover:text-[#006BFF] transition-colors flex items-center gap-1"
              >
                {item}
                {["Product", "Solutions", "Resources"].includes(item) && (
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="mt-px">
                    <path
                      d="M1 1L5 5L9 1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-[15px] font-semibold text-[#0B3558] hover:text-[#006BFF] transition-colors hidden sm:block"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="h-10 px-5 rounded-lg bg-[#006BFF] text-white text-[15px] font-semibold hover:bg-[#0060E6] transition-all hover:shadow-lg hover:shadow-blue-200 flex items-center"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
