"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function PricingSnippet() {
  return (
    <section className="py-24 bg-[#FAFBFC] border-t border-gray-100">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[40px] font-bold text-[#0B3558] tracking-tight mb-4">
            Find the perfect plan for you
          </h2>
          <p className="text-[18px] text-[#476788] max-w-[540px] mx-auto">
            Whether you are an individual or an enterprise, Calendly scale with your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-[800px] mx-auto">
          {/* Basic Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-8 border border-gray-200 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
          >
            <h3 className="text-xl font-bold text-[#0B3558] mb-2">Free</h3>
            <p className="text-sm text-[#476788] h-10">The basics for individuals getting started.</p>
            <div className="text-[40px] font-bold text-[#0B3558] my-6">
              $0<span className="text-lg text-[#476788] font-normal">/seat/mo</span>
            </div>
            <Link
              href="/register"
              className="w-full h-[48px] rounded-lg border-2 border-[#0B3558] text-[#0B3558] font-bold flex items-center justify-center hover:bg-[#0B3558] hover:text-white transition-colors mb-8"
            >
              Sign up
            </Link>
            <ul className="space-y-4">
              {["1 connected calendar", "1 active event type", "Automated event notifications", "Google Meet integration"].map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 text-[#006BFF] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-sm font-medium text-[#0B3558]">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Standard Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#0B3558] rounded-3xl p-8 border border-[#0B3558] shadow-2xl relative"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#006BFF] text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full">
              Most Popular
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Standard</h3>
            <p className="text-sm text-blue-200 h-10">Perfect for teams needing more customization.</p>
            <div className="text-[40px] font-bold text-white my-6">
              $10<span className="text-lg text-blue-200 font-normal">/seat/mo</span>
            </div>
            <Link
              href="/register"
              className="w-full h-[48px] rounded-lg bg-[#006BFF] text-white font-bold flex items-center justify-center hover:bg-[#0060E6] transition-colors mb-8"
            >
              Sign up
            </Link>
            <ul className="space-y-4">
              {["Multiple connected calendars", "Unlimited event types", "Collective & Round Robin", "Custom email notifications"].map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 text-[#006BFF] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-sm font-medium text-white">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
