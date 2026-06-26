/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useApp } from "../context/AppContext";
import { User, Shield, Palette, Bell, HelpCircle, LogOut, Trash2, Layers, BookOpen, Compass, Check } from "lucide-react";
import { motion } from "motion/react";

export const ProfileView: React.FC = () => {
  const { user, settings, updateSettings, watchlist, savedArticles, logout, clearCache, deleteAccount } = useApp();

  const handleThemeChange = (themeName: "dark-green" | "light" | "midnight") => {
    updateSettings({ theme: themeName });
  };

  const handleTogglePush = () => {
    updateSettings({ pushNotifications: !settings.pushNotifications });
  };

  const handleToggleEmail = () => {
    updateSettings({ emailNotifications: !settings.emailNotifications });
  };

  return (
    <div className="flex flex-col pb-32 pt-6 px-4 max-w-lg mx-auto w-full">
      {/* 1. Header Title */}
      <div className="mb-8">
        <span className="text-[10px] font-mono tracking-widest text-[#A6B0AA] uppercase font-semibold block mb-0.5">PREFERENCES & VAULT</span>
        <h1 className="font-display text-2xl font-black text-white tracking-tight">Security & Settings</h1>
      </div>

      {/* 2. User Info Card */}
      <div className="bg-gradient-to-br from-[#163A2D]/80 to-[#0D2B22]/80 border border-white/10 rounded-[24px] p-5 mb-6 flex items-center gap-4 relative overflow-hidden shadow-xl">
        {/* Decorative backdrop */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#B6FF5A]/10 rounded-full blur-xl pointer-events-none" />

        <div className="w-14 h-14 rounded-full bg-[#163A2D] border border-[#B6FF5A]/30 flex items-center justify-center text-[#B6FF5A] font-black text-lg font-display shadow-md">
          {user?.name ? user.name.charAt(0).toUpperCase() : "I"}
        </div>
        
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-white">{user?.name || "Investor"}</h2>
            <span className="text-[8px] font-mono font-black tracking-widest bg-[#B6FF5A]/15 border border-[#B6FF5A]/25 text-[#B6FF5A] px-2 py-0.5 rounded uppercase shadow-sm">
              {user?.membership || "Pro"}
            </span>
          </div>
          <p className="text-xs text-[#A6B0AA] mt-1 font-medium">{user?.email || "investor@finscope.ai"}</p>
          <p className="text-[9px] text-[#A6B0AA]/60 font-mono mt-1 font-bold">Country: {user?.country || "United States"}</p>
        </div>
      </div>

      {/* 3. Stats Bento boxes */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-[#163A2D]/80 to-[#0D2B22]/80 border border-white/10 p-4 rounded-[20px] flex items-center gap-3 shadow-md">
          <div className="p-2.5 rounded-xl bg-[#B6FF5A]/10 text-[#B6FF5A] border border-[#B6FF5A]/20 shadow-sm">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-[#A6B0AA] font-bold">Watchlist</p>
            <p className="text-sm font-black font-mono text-white mt-0.5">{watchlist.length} Assets</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#163A2D]/80 to-[#0D2B22]/80 border border-white/10 p-4 rounded-[20px] flex items-center gap-3 shadow-md">
          <div className="p-2.5 rounded-xl bg-[#B6FF5A]/10 text-[#B6FF5A] border border-[#B6FF5A]/20 shadow-sm">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-[#A6B0AA] font-bold">Bookmarks</p>
            <p className="text-sm font-black font-mono text-white mt-0.5">{savedArticles.length} Stories</p>
          </div>
        </div>
      </div>

      {/* 4. Theme customization selector */}
      <div className="mb-6">
        <h3 className="text-xs font-mono tracking-widest text-[#A6B0AA] uppercase mb-3 flex items-center gap-1.5 font-bold">
          <Palette className="w-3.5 h-3.5 text-[#B6FF5A]" />
          Custom Visual Themes
        </h3>
        
        <div className="grid grid-cols-3 gap-2.5">
          {/* Theme Dark Green */}
          <button
            onClick={() => handleThemeChange("dark-green")}
            className={`p-3 rounded-[20px] border text-center transition-all ${
              settings.theme === "dark-green"
                ? "bg-[#163A2D] border-[#B6FF5A] text-white shadow-lg shadow-[#B6FF5A]/5 font-black"
                : "bg-[#163A2D]/30 border-white/10 text-[#A6B0AA] hover:border-white/20 font-bold"
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-[#071C16] mx-auto mb-2 border border-[#B6FF5A]/30" />
            <p className="text-[10px]">Dark Green</p>
          </button>

          {/* Theme Midnight */}
          <button
            onClick={() => handleThemeChange("midnight")}
            className={`p-3 rounded-[20px] border text-center transition-all ${
              settings.theme === "midnight"
                ? "bg-[#1A233A] border-[#38BDF8] text-white shadow-lg font-black"
                : "bg-[#163A2D]/30 border-white/10 text-[#A6B0AA] hover:border-white/20 font-bold"
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-[#090D16] mx-auto mb-2 border border-[#38BDF8]/30" />
            <p className="text-[10px]">Midnight</p>
          </button>

          {/* Theme Light */}
          <button
            onClick={() => handleThemeChange("light")}
            className={`p-3 rounded-[20px] border text-center transition-all ${
              settings.theme === "light"
                ? "bg-white border-emerald-600 text-[#0F1A15] shadow-lg font-black"
                : "bg-[#163A2D]/30 border-white/10 text-[#A6B0AA] hover:border-white/20 font-bold"
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-[#F3F5F4] mx-auto mb-2 border border-emerald-600/30" />
            <p className="text-[10px]">Light Mode</p>
          </button>
        </div>
      </div>

      {/* 5. Alerts Toggle Options */}
      <div className="bg-gradient-to-br from-[#163A2D]/80 to-[#0D2B22]/80 border border-white/10 rounded-[24px] p-5 mb-6 space-y-4 shadow-xl">
        <h3 className="text-xs font-mono tracking-widest text-[#A6B0AA] uppercase border-b border-white/10 pb-3 flex items-center gap-1.5 font-bold">
          <Bell className="w-3.5 h-3.5 text-[#B6FF5A]" />
          Alert Configurations
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-white">Push Alert Triggers</p>
            <p className="text-[10px] text-[#A6B0AA] mt-0.5 font-medium">Instant alerts when targets break</p>
          </div>
          <button
            onClick={handleTogglePush}
            className={`w-11 h-6 rounded-full p-1 transition-all ${
              settings.pushNotifications ? "bg-[#B6FF5A]" : "bg-white/15"
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-[#071C16] transition-transform ${
              settings.pushNotifications ? "translate-x-5" : "translate-x-0"
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-white">Daily Summary Briefings</p>
            <p className="text-[10px] text-[#A6B0AA] mt-0.5 font-medium">Receive morning market reviews</p>
          </div>
          <button
            onClick={handleToggleEmail}
            className={`w-11 h-6 rounded-full p-1 transition-all ${
              settings.emailNotifications ? "bg-[#B6FF5A]" : "bg-white/15"
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-[#071C16] transition-transform ${
              settings.emailNotifications ? "translate-x-5" : "translate-x-0"
            }`} />
          </button>
        </div>
      </div>

      {/* 6. Administrative Operations Row */}
      <div className="space-y-3">
        <button
          onClick={clearCache}
          className="w-full py-4 rounded-[18px] bg-gradient-to-r from-white/5 to-white/[0.08] border border-white/10 hover:bg-white/10 text-white text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-2"
        >
          <Layers className="w-4 h-4 text-[#B6FF5A]" />
          PURGE CACHED QUOTES
        </button>

        <button
          onClick={logout}
          className="w-full py-4 rounded-[18px] bg-gradient-to-r from-white/5 to-white/[0.08] border border-white/10 hover:bg-[#FF5D5D]/10 hover:text-[#FF5D5D] hover:border-[#FF5D5D]/20 text-[#A6B0AA] text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-2"
          id="profile-logout-btn"
        >
          <LogOut className="w-4 h-4" />
          TERMINATE SECURE SESSION
        </button>

        <button
          onClick={() => {
            if (confirm("Are you sure you want to permanently delete your data sandbox? This action is irreversible.")) {
              deleteAccount();
            }
          }}
          className="w-full py-4 rounded-[18px] bg-red-500/10 border border-red-500/15 hover:bg-red-500/20 text-red-400 text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          DELETE FINNHUB CREDENTIALS
        </button>
      </div>
    </div>
  );
};
