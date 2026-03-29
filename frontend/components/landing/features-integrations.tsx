"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function FeaturesIntegrations() {
  const tools = [
    { name: "Google Calendar", color: "#4285F4", icon: "📅" },
    { name: "Zoom", color: "#2D8CFF", icon: "🎥" },
    { name: "Slack", color: "#4A154B", icon: "💬" },
    { name: "Microsoft Outlook", color: "#0078D4", icon: "📧" },
    { name: "Salesforce", color: "#00A1E0", icon: "☁️" },
    { name: "HubSpot", color: "#FF7A59", icon: "🧲" },
  ];

  return (
    <section className="py-24 bg-[#FAFBFC] border-t border-gray-100">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[32px] md:text-[40px] font-bold text-[#0B3558] tracking-tight mb-4">
              Connect Calendly to the tools you already use
            </h2>
            <p className="text-[18px] text-[#476788] mb-8 max-w-[460px]">
              Boost productivity with 100+ integrations. Sync your calendar, video conferencing, CRM, and more.
            </p>
            <Link href="/register" className="text-[16px] font-semibold text-[#006BFF] hover:underline flex items-center gap-2">
              View all integrations →
            </Link>
          </motion.div>
          {/* Integration Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-4"
          >
            {tools.map((tool, i) => (
              <motion.div
                key={tool.name}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 107, 255, 0.1)" }}
                className="bg-white rounded-xl p-5 border border-gray-100 hover:border-blue-100 transition-all duration-200 flex flex-col items-center text-center gap-2 cursor-default"
              >
                <span className="text-3xl">{tool.icon}</span>
                <span className="text-[13px] font-semibold text-[#0B3558]">{tool.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
