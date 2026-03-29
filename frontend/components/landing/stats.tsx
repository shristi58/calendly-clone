"use client";

import { motion } from "framer-motion";

export function Stats() {
  const statsList = [
    { stat: "169%", label: "Return on investment", sub: "Average ROI with Calendly" },
    { stat: "75%", label: "Faster scheduling", sub: "Less time coordinating meetings" },
    { stat: "85%", label: "More meetings booked", sub: "When using Calendly links" },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-[32px] md:text-[40px] font-bold text-[#0B3558] tracking-tight mb-4">
            The results speak for themselves
          </h2>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {statsList.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center p-8 lg:p-10 rounded-3xl bg-gradient-to-b from-[#E5F1FF]/50 to-white border border-blue-50/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: i * 0.1 + 0.3 }}
                className="text-[48px] lg:text-[64px] font-bold text-[#006BFF] mb-2 tracking-tighter"
              >
                {item.stat}
              </motion.div>
              <div className="text-[18px] lg:text-[20px] font-bold text-[#0B3558] mb-1">{item.label}</div>
              <div className="text-[15px] text-[#476788]">{item.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
