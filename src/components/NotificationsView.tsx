/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useApp } from "../context/AppContext";
import { Bell, Sparkles, TrendingUp, Cpu, Calendar, CheckSquare, Shield } from "lucide-react";
import { motion } from "motion/react";

interface NotificationsViewProps {
  onBack: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ onBack }) => {
  const { notifications, markAllNotificationsRead } = useApp();

  // Group notifications by relative categories: Today, Yesterday, Earlier
  const categories = ["Today", "Yesterday", "Earlier"];

  const getNotifIcon = (type: string) => {
    if (type === "price_alert") return <TrendingUp className="w-4 h-4 text-[#B6FF5A]" />;
    if (type === "system") return <Cpu className="w-4 h-4 text-emerald-400" />;
    return <Sparkles className="w-4 h-4 text-amber-400" />;
  };

  return (
    <div className="flex flex-col pb-32 pt-6 px-4 max-w-lg mx-auto w-full">
      {/* Header controls */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#A6B0AA] uppercase font-semibold block mb-0.5">CHRONO TIMELINE</span>
          <h1 className="font-display text-2xl font-black text-white tracking-tight">Market Alerts</h1>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={markAllNotificationsRead}
            className="px-4 py-2.5 rounded-[14px] bg-[#163A2D] border border-white/10 text-[10px] text-white hover:text-[#B6FF5A] hover:border-[#B6FF5A]/40 font-black flex items-center gap-1.5 transition-all shadow-md"
          >
            <CheckSquare className="w-3.5 h-3.5 text-[#B6FF5A]" />
            MARK READ
          </button>
          
          <button
            onClick={onBack}
            className="px-4 py-2.5 rounded-[14px] bg-[#163A2D] border border-white/10 text-[10px] text-[#A6B0AA] hover:text-white hover:border-white/20 font-black transition-all shadow-md"
          >
            BACK
          </button>
        </div>
      </div>

      {/* Main notifications log grouped */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const matching = notifications.filter((n) => n.category === cat);
          if (matching.length === 0) return null;

          return (
            <div key={cat} className="space-y-3">
              <h3 className="text-xs font-mono tracking-widest text-[#A6B0AA] uppercase flex items-center gap-1.5 border-b border-white/10 pb-2.5 font-bold">
                <Calendar className="w-3.5 h-3.5 text-[#B6FF5A]" />
                {cat}
              </h3>

              <div className="space-y-3">
                {matching.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 rounded-[24px] border transition-all flex gap-3.5 relative overflow-hidden shadow-lg ${
                      n.isRead
                        ? "bg-[#163A2D]/40 border-white/10"
                        : "bg-gradient-to-br from-[#163A2D]/85 to-[#0D2B22]/85 border-[#B6FF5A]/30 shadow-[0_0_20px_rgba(182,255,90,0.04)]"
                    }`}
                  >
                    {/* Unread indicators indicator border */}
                    {!n.isRead && (
                      <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#B6FF5A]" />
                    )}

                    <div className="w-9 h-9 rounded-[10px] bg-[#071C16]/80 flex items-center justify-center shrink-0 border border-white/10 shadow-sm">
                      {getNotifIcon(n.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="text-xs font-black text-white">{n.title}</h4>
                        <span className="text-[8px] font-mono text-[#A6B0AA] font-bold">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A6B0AA] font-medium leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {notifications.length === 0 && (
          <div className="text-center py-12 bg-gradient-to-br from-[#163A2D]/40 to-[#0D2B22]/40 rounded-[24px] border border-dashed border-white/15 p-6 shadow-md">
            <Bell className="w-8 h-8 text-[#B6FF5A]/60 mx-auto mb-3" />
            <p className="text-sm text-white font-bold">Timeline is perfectly clear</p>
            <p className="text-xs text-[#A6B0AA] mt-1 max-w-xs mx-auto leading-relaxed">
              Any alerts triggered by your price threshold parameters will manifest instantly here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
