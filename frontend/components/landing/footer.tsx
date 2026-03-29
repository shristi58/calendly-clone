"use client";

import Link from "next/link";
import { CalendlyLogo } from "@/components/shared/calendly-logo";

export function Footer() {
  const columns = [
    {
      title: "Product",
      links: [
        "Scheduling automation",
        "Meeting Notetaker",
        "Payments",
        "Customizable availability",
        "Mobile apps",
        "Browser extensions",
        "Meeting routing",
        "Event Types",
        "Email & website embeds",
        "Reminders & follow-ups",
        "Meeting polls",
        "Analytics",
        "Admin management",
      ],
    },
    {
      title: "Integrations",
      links: [
        "Google ecosystem",
        "Microsoft ecosystem",
        "Calendars",
        "Video conferencing",
        "Payment processors",
        "Sales & CRM",
        "Recruiting & ATS",
        "Email messaging",
        "Embed Calendly",
        "Analytics",
        "API & connectors",
        "Security & compliance",
      ],
    },
    {
      title: "Calendly",
      links: [
        "Pricing",
        "Product overview",
        "Solutions",
        "For individuals",
        "For small businesses",
        "For large companies",
        "Compare",
        "Security",
        "Sign up for free",
        "Talk to sales",
        "Get a demo",
      ],
    },
    {
      title: "Resources",
      links: [
        "Help center",
        "Resource center",
        "Blog",
        "Customer stories",
        "Calendly community",
        "Developer tools",
        "Release notes",
      ],
    },
    {
      title: "Company",
      links: [
        "About us",
        "Leadership",
        { name: "Careers", badge: "We're hiring!" },
        "Newsroom",
        "Become a partner",
        "Contact us",
      ],
    },
  ];

  const downloads = [
    "App Store",
    "Google Play",
    "Chrome extension",
    "Edge extension",
    "Firefox extension",
    "Safari extension",
    "Outlook add-in",
  ];

  return (
    <footer className="bg-[#fcfaf9] text-[#0B3558] pt-24 pb-8 flex flex-col items-center">
      <div className="max-w-[1280px] w-full px-6 flex flex-col items-center">
        {/* Main Footer Links */}
        <div className="w-full grid grid-cols-2 md:grid-cols-5 gap-12 mb-20 text-sm">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-[#0B3558] mb-6">{col.title}</h4>
              <ul className="flex flex-col gap-4">
                {col.links.map((link, i) => {
                  const isObj = typeof link === "object";
                  const name = isObj ? link.name : link;
                  const badge = isObj ? link.badge : null;
                  return (
                    <li key={i}>
                      <Link
                        href="#"
                        className="text-[#667B9A] hover:text-[#0B3558] transition-colors"
                      >
                        {name}
                        {badge && (
                          <span className="ml-2 text-[11px] bg-[#E8F1FF] text-[#006BFF] px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                            {badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Downloads and Social */}
        <div className="w-full flex justify-between items-end mb-12">
          <div className="flex-1 w-full max-w-4xl">
            <h4 className="font-bold text-[#0B3558] mb-6">Downloads</h4>
            <div className="flex flex-wrap gap-2 text-[14px]">
              {downloads.map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="flex items-center gap-2 bg-[#F1F3F6] text-[#0B3558] font-medium px-4 py-2.5 rounded-md hover:bg-[#E5E9F0] transition-colors"
                >
                  <div className="w-4 h-4 bg-gray-300 rounded-full shrink-0" /> {/* Placeholder for logos */}
                  {item}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4">
            {/* Minimal Social Icons */}
            {["X", "Facebook", "Instagram", "LinkedIn", "YouTube"].map((social) => (
              <a
                key={social}
                href="#"
                className="w-8 h-8 rounded-full bg-transparent hover:bg-gray-100 flex items-center justify-center transition-colors"
                aria-label={social}
              >
                <div className="w-4 h-4 bg-[#0B3558] opacity-80" /> {/* Mock social icon */}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="w-full border-t border-gray-200 pt-8 flex flex-col lg:flex-row items-center justify-between gap-6 text-[13px] text-[#667B9A]">
          <div className="flex items-center gap-2 text-inherit hover:text-[#0B3558]">
            <svg
              className="w-5 h-5 text-current"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">English</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 font-medium">
            <Link href="/legal/privacy-notice" className="hover:text-[#0B3558] hover:underline">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="hover:text-[#0B3558] hover:underline">
              Legal
            </Link>
            <Link href="#" className="hover:text-[#0B3558] hover:underline">
              Status
            </Link>
            <Link href="#" className="hover:text-[#0B3558] hover:underline">
              Cookie Settings
            </Link>
            <Link href="#" className="flex items-center gap-2 hover:text-[#0B3558] hover:underline">
              <div className="w-6 h-3 bg-blue-500 rounded-sm" />
              Your Privacy Choices
            </Link>
          </div>

          <div>
            Copyright Calendly 2026
          </div>
        </div>
      </div>
    </footer>
  );
}
