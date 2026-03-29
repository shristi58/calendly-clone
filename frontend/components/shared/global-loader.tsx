"use client";

import { useEffect, useState } from "react";

export function GlobalLoader() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
      <div className="flex gap-2 mb-6">
        <div className="w-2.5 h-2.5 rounded-full bg-[#1e2a3b] animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#1e2a3b] animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#1e2a3b] animate-bounce"></div>
      </div>
      <p className="text-[#0a2540] font-bold text-[15px] tracking-tight antialiased">
        Setting up your Calendly
      </p>
    </div>
  );
}
