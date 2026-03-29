"use client";

import Link from "next/link";
import { CalendlyLogo } from "@/components/shared/calendly-logo";

export function Footer() {
  const columns = [
    {
      title: "Product",
      links: ["Scheduling", "Availability", "Integrations", "Event Types", "Teams"],
    },
    {
      title: "Solutions",
      links: ["Sales", "Marketing", "Customer Success", "Recruiting", "IT"],
    },
    {
      title: "Resources",
      links: ["Blog", "Resource Library", "Developers", "Community", "Tutorials"],
    },
    {
      title: "About",
      links: ["About Us", "Careers", "Press", "Partners", "Contact"],
    },
    {
      title: "Support",
      links: ["Help Center", "API Documentation", "Status", "Security", "GDPR"],
    },
  ];

  return (
    <footer className="bg-[#0B3558] border-t border-white/10 text-white pt-24 pb-12">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-x-8 gap-y-16 mb-20 text-blue-100/80">
          <div className="col-span-2 lg:col-span-1 lg:pr-8">
            <div className="mb-6 flex flex-col gap-1 text-[13px]">
              <div className="mb-2">
                <CalendlyLogo size="sm" />
              </div>
              <p className="opacity-70 leading-relaxed mb-6">
                We take the work out of connecting with others so you can accomplish more.
              </p>
            </div>
            {/* Social Icons (using simple SVGs) */}
            <div className="flex items-center gap-5 outline-none focus:outline-none">
              <a href="#" className="opacity-60 hover:opacity-100 hover:text-white transition-opacity outline-none" aria-label="Twitter">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </a>
              <a href="#" className="opacity-60 hover:opacity-100 hover:text-white transition-opacity outline-none" aria-label="Facebook">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="opacity-60 hover:opacity-100 hover:text-white transition-opacity outline-none" aria-label="LinkedIn">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="#" className="opacity-60 hover:opacity-100 hover:text-white transition-opacity outline-none" aria-label="Instagram">
                <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" width="20" height="20"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[17px] font-bold text-white mb-6 uppercase tracking-tight">{col.title}</h4>
              <ul className="flex flex-col gap-4">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-[15px] hover:text-white transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
          <div className="text-[14px]">
            © {new Date().getFullYear()} Calendly. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-[14px]">
            {["Privacy", "Terms", "Cookie Settings", "Sitemap"].map((link) => (
              <a key={link} href="#" className="hover:text-white hover:underline transition-all">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
