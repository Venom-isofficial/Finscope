/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Home, BarChart2, Newspaper, Cpu, User } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  unreadNotificationsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab, unreadNotificationsCount = 0 }) => {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "markets", label: "Markets", icon: BarChart2 },
    { id: "news", label: "News", icon: Newspaper },
    { id: "ai", label: "AI Advisor", icon: Cpu },
    { id: "profile", label: "Profile", icon: User }
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-lg md:hidden">
      <div className="glass-panel rounded-[24px] px-3 py-2 flex items-center justify-between border border-white/5 shadow-2xl relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className="flex-1 flex flex-col items-center justify-center py-2 px-1 relative rounded-2xl transition-all outline-none"
              id={`tab-btn-${tab.id}`}
            >
              {/* Active backing spotlight block */}
              {isActive && (
                <div className="absolute inset-0 bg-white/[0.04] rounded-2xl border-t border-white/[0.04]" />
              )}

              {/* Floating notification indicator badge on News or Profile tabs */}
              {tab.id === "profile" && unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-4 w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}

              <Icon
                className={`w-5 h-5 mb-1 transition-all duration-300 relative z-10 ${
                  isActive ? "text-[var(--accent)] scale-110" : "text-[var(--text-secondary)] hover:text-white"
                }`}
              />
              
              <span
                className={`text-[9px] font-medium tracking-wide transition-colors duration-300 relative z-10 ${
                  isActive ? "text-white" : "text-[var(--text-secondary)]"
                }`}
              >
                {tab.label}
              </span>
              
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[var(--accent)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
