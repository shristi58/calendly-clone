import { Navigation } from "@/components/landing/navigation";
import { Footer } from "@/components/landing/footer";
import Link from "next/link";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      <Navigation />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-[250px_1fr] gap-12">
          {/* Sidebar */}
          <aside className="hidden md:block">
            <div className="sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Overview</h2>
              <ul className="space-y-4">
                <li>
                  <div className="text-base font-bold text-gray-900 mb-2">Terms</div>
                  <ul className="space-y-3 pl-4 border-l-2 border-gray-100">
                    <li>
                      <Link 
                        href="/legal/terms" 
                        className="text-gray-600 hover:text-blue-600 font-medium text-[15px] transition-colors"
                      >
                        Definitions
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <div className="text-base font-bold text-gray-900 mb-2 mt-6">Policies</div>
                  <ul className="space-y-3 pl-4 border-l-2 border-gray-100">
                    <li>
                      <Link 
                        href="/legal/privacy-notice" 
                        className="text-gray-600 hover:text-blue-600 font-medium text-[15px] transition-colors"
                      >
                        Privacy Notice
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <div className="min-w-0 bg-white">
            <div className="prose prose-blue prose-lg max-w-none text-gray-600 leading-relaxed md:pl-8">
              {children}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
