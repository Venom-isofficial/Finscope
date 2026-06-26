/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";
import { motion } from "motion/react";

interface SplashProps {
  onComplete: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#071C16] via-[#09261E] to-[#040E0B] overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#B6FF5A]/5 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#163A2D]/30 blur-[120px]" />

      <div className="relative flex flex-col items-center">
        {/* Animated Graph Line behind Logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <svg className="w-64 h-32" viewBox="0 0 200 100" fill="none">
            <motion.path
              d="M0,80 Q30,20 60,60 T120,30 T180,70 L200,40"
              stroke="#B6FF5A"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            {/* Glowing endpoint node */}
            <motion.circle
              cx="200"
              cy="40"
              r="4"
              fill="#B6FF5A"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 1] }}
              transition={{ delay: 1.8, duration: 0.4 }}
            />
          </svg>
        </div>

        {/* Brand Logomark */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10 w-24 h-24 mb-6 rounded-3xl bg-[#163A2D] flex items-center justify-center border border-[#B6FF5A]/20 shadow-[0_0_50px_rgba(182,255,90,0.15)]"
        >
          {/* Custom premium compass/scope compass vector icon */}
          <svg className="w-12 h-12 text-[#B6FF5A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <motion.div
            className="absolute inset-0 rounded-3xl border border-[#B6FF5A]"
            initial={{ opacity: 0.4, scale: 1 }}
            animate={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        </motion.div>

        {/* App Branding */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-display text-4xl font-bold tracking-tight text-white mb-2"
          id="splash-title"
        >
          Fin<span className="text-[#B6FF5A]">Scope</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 0.7 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-[#A6B0AA] text-sm font-light tracking-wide text-center"
          id="splash-tagline"
        >
          Understand Markets. <span className="text-white">Not Just Prices.</span>
        </motion.p>
      </div>

      {/* Elegant minimalist loader bar */}
      <div className="absolute bottom-16 w-48 h-1 bg-[#163A2D] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#B6FF5A] to-[#D8FF7E]"
          initial={{ left: "-100%", width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.8, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};
