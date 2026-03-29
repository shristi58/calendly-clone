"use client";

import { motion } from "framer-motion";

export function FeaturesHowItWorks() {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-[-100px] w-[300px] h-[300px] bg-gradient-to-br from-purple-100/40 to-pink-100/30 rounded-full blur-3xl" />
      </div>
      <div className="max-w-[1280px] mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-[32px] md:text-[40px] font-bold text-[#0B3558] tracking-tight mb-4">
            How Calendly works
          </h2>
          <p className="text-[18px] text-[#476788] max-w-[540px] mx-auto">
            Set your availability, share your link, and let others book time with you. No more back-and-forth emails.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#006BFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              ),
              title: "Set your availability",
              desc: "Let Calendly know your availability preferences and it does the work for you.",
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#006BFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
              ),
              title: "Share your link",
              desc: "Send your Calendly link via email or embed it on your website.",
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#006BFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              ),
              title: "Get booked",
              desc: "Invitees pick a time and the event is added to everyone's calendar.",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-[#E5F1FF] flex items-center justify-center mb-5 group-hover:bg-[#006BFF] group-hover:scale-110 transition-all duration-300">
                <div className="group-hover:[&_svg]:stroke-white transition-colors">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-[18px] font-bold text-[#0B3558] mb-2">{feature.title}</h3>
              <p className="text-[15px] text-[#476788] leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
