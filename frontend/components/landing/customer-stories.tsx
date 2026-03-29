"use client";

import { motion } from "framer-motion";

export function CustomerStories() {
  const brands = ["Dropbox", "Twilio", "Compass", "Lyft", "L'Oréal", "Gong", "Zapier", "Zendesk", "Dropbox", "Twilio", "Compass", "Lyft"];

  return (
    <section className="bg-[#FAFBFC] pt-16 pb-24 border-t border-gray-100 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 mb-12">
        <p className="text-center text-[18px] font-semibold text-[#0B3558] tracking-normal mb-10 text-opacity-80">
          Simplified scheduling for more than <span className="text-[#006BFF] font-bold">20 million</span> users worldwide
        </p>
      </div>

      {/* Marquee Animation using Framer Motion */}
      <div className="relative w-full flex overflow-hidden">
        {/* Left Gradient Overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#FAFBFC] to-transparent z-10" />
        
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          }}
          className="flex items-center gap-16 whitespace-nowrap opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500"
        >
          {brands.map((brand, i) => (
            <div
              key={`${brand}-${i}`}
              className="text-2xl font-bold text-gray-700 tracking-tight cursor-default"
            >
              {brand}
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {brands.map((brand, i) => (
            <div
              key={`${brand}-dup-${i}`}
              className="text-2xl font-bold text-gray-700 tracking-tight cursor-default"
            >
              {brand}
            </div>
          ))}
        </motion.div>

        {/* Right Gradient Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#FAFBFC] to-transparent z-10" />
      </div>
    </section>
  );
}
