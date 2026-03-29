"use client";

import Link from "next/link";
import { CalendlyLogo } from "@/components/shared/calendly-logo";
import {
  FaXTwitter,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaApple,
  FaGooglePlay,
  FaChrome,
  FaEdge,
  FaFirefoxBrowser,
  FaSafari,
  FaEnvelope,
} from "react-icons/fa6";
import { HiGlobeAlt, HiChevronDown } from "react-icons/hi2";

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
    { name: "App Store", icon: <FaApple className="w-4 h-4" /> },
    { name: "Google Play", icon: <FaGooglePlay className="w-3.5 h-3.5" /> },
    { name: "Chrome extension", icon: <FaChrome className="w-4 h-4" /> },
    { name: "Edge extension", icon: <FaEdge className="w-4 h-4" /> },
    { name: "Firefox extension", icon: <FaFirefoxBrowser className="w-4 h-4" /> },
    { name: "Safari extension", icon: <FaSafari className="w-4 h-4" /> },
    { name: "Outlook add-in", icon: <FaEnvelope className="w-4 h-4" /> },
  ];

  const socialLinks = [
    { name: "X", icon: <FaXTwitter className="w-4 h-4" />, href: "#" },
    { name: "Facebook", icon: <FaFacebookF className="w-4 h-4" />, href: "#" },
    { name: "Instagram", icon: <FaInstagram className="w-4 h-4" />, href: "#" },
    { name: "LinkedIn", icon: <FaLinkedinIn className="w-4 h-4" />, href: "#" },
    { name: "YouTube", icon: <FaYoutube className="w-4 h-4" />, href: "#" },
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
        <div className="w-full flex flex-col lg:flex-row justify-between items-end mb-12 gap-8">
          <div className="flex-1 w-full max-w-4xl">
            <h4 className="font-bold text-[#0B3558] mb-6">Downloads</h4>
            <div className="flex flex-wrap gap-2 text-[14px]">
              {downloads.map((item) => (
                <Link
                  key={item.name}
                  href="#"
                  className="flex items-center gap-2.5 bg-[#F1F3F6] text-[#0B3558] font-medium px-4 py-2.5 rounded-md hover:bg-[#E5E9F0] transition-colors"
                >
                  <span className="text-[#476788]">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="w-9 h-9 rounded-full bg-transparent hover:bg-[#E5E9F0] flex items-center justify-center transition-colors text-[#0B3558]/80 hover:text-[#0B3558]"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="w-full border-t border-gray-200 pt-8 flex flex-col lg:flex-row items-center justify-between gap-6 text-[13px] text-[#667B9A]">
          <div className="flex items-center gap-2 text-inherit hover:text-[#0B3558] cursor-pointer transition-colors">
            <HiGlobeAlt className="w-5 h-5" />
            <span className="font-medium">English</span>
            <HiChevronDown className="w-3 h-3" />
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
              <svg width="24" height="12" viewBox="0 0 30 14" className="shrink-0">
                <rect width="30" height="14" rx="7" fill="#006BFF" />
                <circle cx="8" cy="7" r="4.5" fill="white" />
                <circle cx="22" cy="7" r="4.5" fill="white" opacity="0.5" />
              </svg>
              Your Privacy Choices
            </Link>
          </div>

          <div>
            Copyright Calendly {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  );
}
