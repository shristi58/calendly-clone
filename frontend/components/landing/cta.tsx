"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function CTA() {
  return (
    <section className="py-24 bg-[#0B3558] relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[-100px] right-[-50px] w-[400px] h-[400px] bg-gradient-to-br from-[#006BFF]/20 to-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -45, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-100px] left-[-50px] w-[300px] h-[300px] bg-gradient-to-tr from-cyan-500/15 to-[#006BFF]/10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-[640px] mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[36px] md:text-[52px] font-bold text-white tracking-tight leading-[1.1] mb-6">
            Easy scheduling ahead
          </h2>
          <p className="text-[18px] md:text-[21px] text-blue-200/90 mb-10 font-medium">
            Calendly is your scheduling automation platform for eliminating the back-and-forth emails to find the perfect time — and so much more.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center h-[52px] px-8 rounded-lg bg-[#006BFF] text-white text-[16px] font-semibold hover:bg-[#0060E6] transition-all hover:shadow-xl hover:shadow-blue-500/30 group"
            >
              Sign up free
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center h-[52px] px-8 rounded-lg bg-transparent text-white text-[16px] font-semibold border border-white/20 hover:bg-white/10 transition-all hover:border-white/40"
            >
              Log in
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
