/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from "react";

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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-brand-primary via-brand-secondary to-brand-primary overflow-hidden">
      <div className="relative flex flex-col items-center">
        {/* Animated Graph Line behind Logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <svg className="w-64 h-32" viewBox="0 0 200 100" fill="none">
            <path
              d="M0,80 Q30,20 60,60 T120,30 T180,70 L200,40"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round" />
            {/* Glowing endpoint node */}
            <circle
              cx="200"
              cy="40"
              r="4"
              fill="var(--accent)" />
          </svg>
        </div>

        {/* Brand Logomark */}
        <div className="relative z-10 w-24 h-24 mb-6 rounded-2xl bg-brand-card flex items-center justify-center border border-brand-accent/20 shadow-[0_0_50px_rgba(182,255,90,0.15)]"
        >
          {/* Custom premium compass/scope compass vector icon */}
          <svg className="w-12 h-12 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <div
            className="absolute inset-0 rounded-2xl border border-brand-accent" />
        </div>

        {/* App Branding */}
        <h1 className="font-display text-4xl font-bold tracking-tight text-brand-text-primary mb-2"
          id="splash-title"
        >
          Fin<span className="text-brand-accent">Scope</span>
        </h1>

        {/* Tagline */}
        <p className="text-brand-text-secondary text-sm font-light tracking-wide text-center"
          id="splash-tagline"
        >
          Understand Markets. <span className="text-brand-text-primary">Not Just Prices.</span>
        </p>
      </div>

      {/* Elegant minimalist loader bar */}
      <div className="absolute bottom-16 w-48 h-1 bg-brand-card rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-accent to-brand-accent-highlight" />
      </div>
    </div>
  );
};
