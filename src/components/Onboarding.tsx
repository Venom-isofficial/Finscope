/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { TrendingUp, FileText, Cpu, ArrowRight, ShieldCheck, CheckCircle } from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: "Stay Ahead",
      subtitle: "Get financial news from trusted global sources, synchronized with live regulatory announcements.",
      accent: "var(--accent)",
      illustration: (
        <div className="relative w-full h-64 flex items-center justify-center">
          {/* Backdrop ambient glow */}
          <div className="absolute w-48 h-48 bg-[var(--accent)]/10 rounded-full blur-3xl" />
          
          {/* Floating News Cards */}
          <div className="absolute top-4 left-6 w-52 p-4 rounded-2xl glass-panel border border-[var(--accent)]/10 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-widest font-mono text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-full">ECONOMY</span>
              <span className="text-[9px] text-[var(--text-secondary)]">4m ago</span>
            </div>
            <h4 className="text-xs font-semibold text-white line-clamp-2">Fed Signals Rate Cuts After Key CPI Inflation Check</h4>
          </div>

          <div className="absolute top-24 right-4 w-48 p-4 rounded-2xl bg-[var(--bg-card)]/90 border border-white/5 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">TECH</span>
              <span className="text-[9px] text-[var(--text-secondary)]">15m ago</span>
            </div>
            <h4 className="text-xs font-semibold text-white line-clamp-2">Blackwell GPU Demand Reaches Multi-Year Peak</h4>
          </div>

          <div className="absolute bottom-4 left-1/4 w-56 p-4 rounded-2xl glass-panel border border-[var(--accent)]/20 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] text-[var(--text-secondary)]">MARKETS SUMMARY</span>
              <FileText className="w-3 h-3 text-[var(--accent)]" />
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-1">
              <div className="h-full w-4/5 bg-[var(--accent)]" />
            </div>
            <p className="text-[10px] text-[var(--text-secondary)]">AI brief summary generated successfully.</p>
          </div>
        </div>
      )
    },
    {
      title: "Track Everything",
      subtitle: "Consolidated, real-time monitoring of global stocks, top cryptocurrencies, and leading ETFs in one viewport.",
      accent: "#D8FF7E",
      illustration: (
        <div className="relative w-full h-64 flex items-center justify-center">
          <div className="absolute w-52 h-52 bg-emerald-500/5 rounded-full blur-3xl" />

          {/* Interactive Chart & List Overlay */}
          <div className="absolute left-4 top-8 w-52 p-4 rounded-2xl bg-[var(--bg-card)]/90 border border-white/5 shadow-xl"
          >
            <span className="text-[9px] font-mono text-[var(--text-secondary)]">ASSETS LIVE</span>
            <div className="space-y-3 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono bg-white/5 px-2 py-0.5 rounded text-white">AAPL</span>
                  <span className="text-[10px] text-[var(--text-secondary)]">Stock</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold font-mono text-white">$182.52</p>
                  <p className="text-[9px] font-mono text-emerald-400">+1.94%</p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/5 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono bg-[var(--accent)]/10 px-2 py-0.5 rounded text-[var(--accent)]">BTC</span>
                  <span className="text-[10px] text-[var(--text-secondary)]">Crypto</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold font-mono text-white">$67.4K</p>
                  <p className="text-[9px] font-mono text-emerald-400">+2.15%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Graph card */}
          <div className="absolute right-4 bottom-8 w-44 p-4 rounded-2xl glass-panel border border-[var(--accent)]/20 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-mono text-white">QQQ ETF</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            {/* Mock Chart Vector */}
            <svg className="w-full h-12" viewBox="0 0 100 40">
              <defs>
                <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-green)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--chart-green)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,35 L20,30 L40,32 L60,18 L80,22 L100,5" fill="none" stroke="var(--chart-green)" strokeWidth="2" strokeLinecap="round" />
              <path d="M0,35 L20,30 L40,32 L60,18 L80,22 L100,5 L100,40 L0,40 Z" fill="url(#glow)" />
            </svg>
            <div className="flex justify-between items-center mt-2 text-[9px] font-mono text-[var(--text-secondary)]">
              <span>1W Return</span>
              <span className="text-[var(--chart-green)] font-bold">+5.25%</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "AI Powered Insights",
      subtitle: "Leverage advanced Gemini models to immediately extract summaries, compare equities, and consult with our assistant.",
      accent: "var(--btn-accent)",
      illustration: (
        <div className="relative w-full h-64 flex items-center justify-center">
          <div className="absolute w-52 h-52 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />

          {/* AI Advisor Chat simulation */}
          <div className="w-72 p-4 rounded-3xl bg-[var(--bg-card)] border border-[var(--accent)]/30 shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5 text-[var(--accent)]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">FinScope AI Advisor</h4>
                <p className="text-[8px] text-emerald-400">● Analytical Intelligence Active</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-right">
                <span className="inline-block bg-[var(--bg-secondary)] text-white text-[10px] px-3 py-1.5 rounded-2xl rounded-tr-none border border-white/5">
                  Compare Apple vs Microsoft
                </span>
              </div>
              <div className="text-left">
                <span className="inline-block bg-[var(--bg-card)] text-[var(--accent)] text-[10px] px-3 py-1.5 rounded-2xl rounded-tl-none border border-[var(--accent)]/10">
                  Microsoft outperforms on cloud capital efficiency, while Apple demonstrates resilient consumer hardware margins...
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] flex flex-col justify-between p-6 overflow-hidden">
      
      {/* Dynamic Background Glows based on screen */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full opacity-20 blur-[100px] transition-all duration-700"
        style={{ backgroundColor: pages[currentPage].accent }}
      />

      {/* Header Skip button */}
      <div className="flex justify-end pt-4 relative z-10">
        {currentPage < pages.length - 1 && (
          <button
            onClick={onComplete}
            className="text-xs tracking-wider text-[var(--text-secondary)] hover:text-white transition-colors"
            id="onboarding-skip-btn"
          >
            SKIP
          </button>
        )}
      </div>

      {/* Slide Content */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        
          <div
            key={currentPage} className="flex flex-col items-center text-center"
          >
            {/* Visual Illustration Container */}
            <div className="w-full mb-8">
              {pages[currentPage].illustration}
            </div>

            {/* Typography */}
            <h2 className="font-display text-3xl font-bold tracking-tight text-white mb-3" id="onboarding-page-title">
              {pages[currentPage].title}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] font-light leading-relaxed px-4" id="onboarding-page-subtitle">
              {pages[currentPage].subtitle}
            </p>
          </div>
        
      </div>

      {/* Footer controls */}
      <div className="flex flex-col items-center gap-6 pb-6 relative z-10 max-w-md mx-auto w-full">
        {/* Page Dots Indicator */}
        <div className="flex gap-2">
          {pages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentPage === idx ? "w-6 bg-[var(--accent)]" : "w-2 bg-[var(--bg-card)]"
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-[var(--btn-accent)] hover:bg-[var(--accent)] text-[var(--bg-primary)] font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(182,255,90,0.3)] hover:scale-[1.02]"
          id="onboarding-action-btn"
        >
          {currentPage === pages.length - 1 ? (
            <>
              GET STARTED
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              CONTINUE
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
