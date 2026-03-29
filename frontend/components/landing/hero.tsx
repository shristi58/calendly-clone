"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-36">
      {/* Background Blobs */}
      <div className="absolute inset-0 pointer-events-none z-[-1]">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-[-120px] right-[-80px] w-[500px] h-[500px] bg-gradient-to-br from-blue-100/60 to-purple-100/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-[-100px] left-[-60px] w-[400px] h-[400px] bg-gradient-to-tr from-cyan-100/50 to-blue-100/30 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-[560px]"
          >
            <h1 className="text-[52px] lg:text-[70px] font-bold leading-[1.05] tracking-tight text-[#0B3558] mb-6">
              Easy scheduling <span className="text-[#006BFF]">ahead</span>
            </h1>
            <p className="text-[19px] lg:text-[21px] leading-relaxed text-[#476788] mb-10 max-w-[500px]">
              Calendly is your scheduling automation platform for eliminating the back-and-forth emails to find the perfect time — and so much more.
            </p>

            {/* Sign up buttons */}
            <div className="flex flex-col gap-3 max-w-[380px]">
              <Link
                href="/register"
                className="h-[52px] px-6 rounded-lg bg-[#0B3558] text-white text-[16px] font-semibold hover:bg-gray-800 transition-all hover:shadow-xl flex items-center justify-center gap-3 group"
              >
                Sign up free with email
              </Link>
              <Link
                href="/register"
                className="h-[52px] px-6 rounded-lg bg-white text-[#0B3558] text-[16px] font-semibold border border-[#D9DEE3] hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign up with Google
              </Link>
              <Link
                href="/register"
                className="h-[52px] px-6 rounded-lg bg-white text-[#0B3558] text-[16px] font-semibold border border-[#D9DEE3] hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
              >
                <svg width="20" height="20" viewBox="0 0 23 23" fill="none" className="shrink-0">
                  <path d="M1 1h10v10H1z" fill="#F25022"/>
                  <path d="M12 1h10v10H12z" fill="#7FBA00"/>
                  <path d="M1 12h10v10H1z" fill="#00A4EF"/>
                  <path d="M12 12h10v10H12z" fill="#FFB900"/>
                </svg>
                Sign up with Microsoft
              </Link>
            </div>
          </motion.div>

          {/* Right: Hero Visual */}
          <div className="relative hidden lg:block perspective-[1000px]">
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: -10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-[560px] mx-auto ml-auto z-10"
            >
              {/* Main booking card */}
              <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(11,53,88,0.1)] border border-gray-100 p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xl shadow-lg">AC</div>
                  <div>
                    <p className="text-xl font-bold text-[#0B3558]">ACME Corp.</p>
                    <p className="text-sm font-medium text-[#476788]">Introductory Call</p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  {/* Mini calendar */}
                  <div className="flex-1">
                    <div className="text-base font-bold text-[#0B3558] mb-5 pl-2">April 2026</div>
                    <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center">
                      {["SUN","MON","TUE","WED","THU","FRI","SAT"].map((d, i) => (
                        <div key={i} className="text-[10px] font-extrabold text-[#0B3558] tracking-wider mb-2">{d}</div>
                      ))}
                      {/* Empty spaces for realistic calendar starting point */}
                      <div /><div /><div />
                      {Array.from({length: 30}, (_, i) => i + 1).map(d => {
                        const isSelected = d === 15;
                        const isAvailable = d >= 10 && d <= 22 && ![4, 11, 18].includes(d % 7);
                        return (
                          <motion.div
                            key={d}
                            whileHover={isAvailable && !isSelected ? { scale: 1.1 } : {}}
                            className={`py-2 aspect-square flex items-center justify-center mx-auto rounded-full w-9 h-9 text-sm font-bold cursor-pointer transition-all ${
                              isSelected
                                ? "bg-[#006BFF] text-white shadow-md shadow-blue-500/30"
                                : isAvailable
                                ? "text-[#006BFF] bg-blue-50 hover:bg-blue-100"
                                : "text-gray-300"
                            }`}
                          >
                            {d}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Time slots */}
                  <div className="w-32 flex flex-col gap-2.5 pt-12">
                    {["9:00am", "9:30am", "10:00am", "10:30am", "11:00am"].map((t, i) => (
                      <motion.button
                        key={t}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`text-sm font-bold py-3.5 px-4 rounded-lg border transition-all ${
                          i === 2
                            ? "bg-[#006BFF] text-white border-[#006BFF] shadow-md shadow-blue-500/20"
                            : "border-gray-200 text-[#006BFF] hover:border-[#006BFF]"
                        }`}
                      >
                        {t}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating confirmation card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                drag
                dragConstraints={{ top: -50, left: -50, right: 50, bottom: 50 }}
                className="absolute -bottom-10 -right-10 bg-white rounded-xl shadow-2xl shadow-blue-900/15 border border-gray-100 p-5 z-20 w-[240px] cursor-grab active:cursor-grabbing hover:shadow-blue-900/25 transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#0B3558] block">Confirmed</span>
                    <span className="text-xs font-semibold text-[#476788]">You are scheduled</span>
                  </div>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-gray-100">
                  <p className="text-xs font-semibold text-[#0B3558] flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    Apr 15, 2026
                  </p>
                  <p className="text-xs text-[#476788] flex items-center gap-2 font-medium">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    10:00am - 10:30am
                  </p>
                  <p className="text-xs text-[#476788] flex items-center gap-2 font-medium">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15.6 11.6L22 7v10l-6.4-4.5v-1zM4 5h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2z"/></svg>
                    Google Meet
                  </p>
                </div>
              </motion.div>
              
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
