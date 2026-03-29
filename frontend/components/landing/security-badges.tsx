"use client";

import { motion } from "framer-motion";

export function SecurityBadges() {
  const badges = [
    { title: "SOC 2 Type II", desc: "Certified and audited" },
    { title: "ISO 27001", desc: "Information security" },
    { title: "GDPR", desc: "Data protection compliant" },
    { title: "CCPA", desc: "California privacy rights" }
  ];

  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-[1280px] mx-auto px-6 text-center">
        <h2 className="text-[32px] md:text-[40px] font-bold text-[#0B3558] tracking-tight mb-4">
          Enterprise-grade security
        </h2>
        <p className="text-[18px] text-[#476788] max-w-[540px] mx-auto mb-16">
          We protect your data with the highest security standards so you can schedule with confidence.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white border border-gray-100 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300 group"
            >
              <div className="w-16 h-16 rounded-full bg-[#E5F1FF] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg width="28" height="32" viewBox="0 0 24 28" fill="none" stroke="#006BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-[17px] font-bold text-[#0B3558] mb-1">{badge.title}</h3>
              <p className="text-[13px] text-[#476788]">{badge.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
