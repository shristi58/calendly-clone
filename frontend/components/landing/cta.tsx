"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function CTA() {
  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
          {/* Left Text */}
          <div className="md:w-1/2">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-[42px] md:text-[56px] font-extrabold text-[#0B3558] leading-[1.1] tracking-tight"
            >
              Power up your
              <br />
              scheduling
            </motion.h2>
          </div>

          {/* Right Text and Buttons */}
          <div className="md:w-1/2 md:flex md:flex-col md:items-start md:pl-16">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[#667B9A] text-[18px] mb-6"
            >
              Get started in seconds — for free.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/register"
                className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-[#006BFF] text-white text-[16px] font-semibold hover:bg-[#0060E6] transition-colors"
              >
                Start for free
              </Link>
              <Link
                href="#"
                className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-white text-[#0B3558] text-[16px] font-semibold border border-gray-300 hover:border-gray-400 transition-colors"
              >
                Get a demo
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
