/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { useApp } from "../context/AppContext";
import { User, Shield, Palette, Bell, HelpCircle, LogOut, Trash2, Layers, BookOpen, Compass, Check } from "lucide-react";

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
    <div className="flex flex-col pb-32 pt-6 px-4 max-w-lg mx-auto w-full relative z-10">
      {/* 1. Header Title */}
      <div className="mb-8">
        <span className="text-[10px] font-mono tracking-widest text-[var(--text-secondary)] uppercase font-semibold block mb-0.5">PREFERENCES & VAULT</span>
        <h1 className="font-display text-2xl font-black text-[var(--text-primary)] tracking-tight">Security & Settings</h1>
      </div>

      {/* 2. User Info Card */}
      <div className="glass-panel rounded-[24px] p-5 mb-6 flex items-center gap-4 relative overflow-hidden shadow-xl border border-white/5">
        {/* Decorative backdrop glow */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-[var(--accent)] opacity-[0.12] rounded-full blur-xl pointer-events-none" />

        <div className="w-14 h-14 rounded-full bg-[var(--bg-secondary)] border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] font-black text-lg font-display shadow-md overflow-hidden shrink-0">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            user?.name ? user.name.charAt(0).toUpperCase() : "I"
          )}
        </div>
        
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-sm font-black text-[var(--text-primary)] truncate">{user?.name || "Investor"}</h2>
            <span className="text-[8px] font-mono font-black tracking-widest bg-[var(--accent)]/15 border border-[var(--accent)]/25 text-[var(--accent)] px-2 py-0.5 rounded uppercase shadow-sm">
              {user?.membership || "Pro"}
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium truncate">{user?.email || "investor@finscope.ai"}</p>
          <p className="text-[9px] text-[var(--text-secondary)]/60 font-mono mt-1 font-bold">Country: {user?.country || "United States"}</p>
        </div>
      </div>

      {/* 3. Stats Bento boxes */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass-panel p-4 rounded-[20px] flex items-center gap-3 shadow-md border border-white/5">
          <div className="p-2.5 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 shadow-sm">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)] font-bold">Watchlist</p>
            <p className="text-sm font-black font-mono text-[var(--text-primary)] mt-0.5">{watchlist.length} Assets</p>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-[20px] flex items-center gap-3 shadow-md border border-white/5">
          <div className="p-2.5 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 shadow-sm">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)] font-bold">Bookmarks</p>
            <p className="text-sm font-black font-mono text-[var(--text-primary)] mt-0.5">{savedArticles.length} Stories</p>
          </div>
        </div>
      </div>

      {/* 4. Theme customization selector */}
      <div className="mb-6">
        <h3 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-3 flex items-center gap-1.5 font-bold">
          <Palette className="w-3.5 h-3.5 text-[var(--accent)]" />
          Custom Visual Themes
        </h3>
        
        <div className="grid grid-cols-3 gap-2.5">
          {/* Theme Dark Green */}
          <button
            onClick={() => handleThemeChange("dark-green")}
            className={`p-3.5 rounded-[20px] border text-center transition-all duration-300 relative overflow-hidden group cursor-pointer ${
              settings.theme === "dark-green"
                ? "bg-[var(--bg-card)] border-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/10 font-black ring-1 ring-[var(--accent)]/30"
                : "glass-panel border-white/5 text-[var(--text-secondary)] hover:border-white/20 hover:text-[var(--text-primary)] font-bold"
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-[var(--bg-primary)] mx-auto mb-2 border border-[var(--accent)]/40 flex items-center justify-center">
              {settings.theme === "dark-green" && <Check className="w-3 h-3 text-[var(--accent)]" />}
            </div>
            <p className="text-[10px] tracking-wide uppercase font-mono">Forest</p>
          </button>

          {/* Theme Midnight */}
          <button
            onClick={() => handleThemeChange("midnight")}
            className={`p-3.5 rounded-[20px] border text-center transition-all duration-300 relative overflow-hidden group cursor-pointer ${
              settings.theme === "midnight"
                ? "bg-[#1A233A] border-[#38BDF8] text-white shadow-lg shadow-[#38BDF8]/10 font-black ring-1 ring-[#38BDF8]/30"
                : "glass-panel border-white/5 text-[var(--text-secondary)] hover:border-white/20 hover:text-[var(--text-primary)] font-bold"
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-[#090D16] mx-auto mb-2 border border-[#38BDF8]/40 flex items-center justify-center">
              {settings.theme === "midnight" && <Check className="w-3 h-3 text-[#38BDF8]" />}
            </div>
            <p className="text-[10px] tracking-wide uppercase font-mono">Midnight</p>
          </button>

          {/* Theme Light */}
          <button
            onClick={() => handleThemeChange("light")}
            className={`p-3.5 rounded-[20px] border text-center transition-all duration-300 relative overflow-hidden group cursor-pointer ${
              settings.theme === "light"
                ? "bg-white border-[#0D593F] text-[#0F1A15] shadow-lg shadow-[#0D593F]/10 font-black ring-1 ring-[#0D593F]/30"
                : "glass-panel border-white/5 text-[var(--text-secondary)] hover:border-white/20 hover:text-[var(--text-primary)] font-bold"
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-[#F3F5F4] mx-auto mb-2 border-[#0D593F]/40 flex items-center justify-center">
              {settings.theme === "light" && <Check className="w-3 h-3 text-[#0D593F]" />}
            </div>
            <p className="text-[10px] tracking-wide uppercase font-mono">Porcelain</p>
          </button>
        </div>
      </div>

      {/* 5. Alerts Toggle Options */}
      <div className="glass-panel rounded-[24px] p-5 mb-6 space-y-4 shadow-xl border border-white/5">
        <h3 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase border-b border-white/5 pb-3 flex items-center gap-1.5 font-bold">
          <Bell className="w-3.5 h-3.5 text-[var(--accent)]" />
          Alert Configurations
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-[var(--text-primary)]">Push Alert Triggers</p>
            <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-medium">Instant alerts when targets break</p>
          </div>
          <button
            onClick={handleTogglePush}
            className={`w-11 h-6 rounded-full p-1 transition-all duration-300 cursor-pointer ${
              settings.pushNotifications ? "bg-[var(--accent)]" : "bg-black/20 border border-white/5"
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-[var(--bg-primary)] transition-transform duration-300 ${
              settings.pushNotifications ? "translate-x-5" : "translate-x-0"
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-[var(--text-primary)]">Daily Summary Briefings</p>
            <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-medium">Receive morning market reviews</p>
          </div>
          <button
            onClick={handleToggleEmail}
            className={`w-11 h-6 rounded-full p-1 transition-all duration-300 cursor-pointer ${
              settings.emailNotifications ? "bg-[var(--accent)]" : "bg-black/20 border border-white/5"
            }`}
          >
            <div className={`w-4 h-4 rounded-full bg-[var(--bg-primary)] transition-transform duration-300 ${
              settings.emailNotifications ? "translate-x-5" : "translate-x-0"
            }`} />
          </button>
        </div>
      </div>

      {/* 6. Administrative Operations Row */}
      <div className="space-y-3">
        <button
          onClick={clearCache}
          className="w-full py-4 rounded-[18px] bg-white/[0.02] border border-white/5 hover:bg-[var(--accent)]/10 hover:text-[var(--accent)] hover:border-[var(--accent)]/20 text-[var(--text-primary)] text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <Layers className="w-4 h-4 text-[var(--accent)]" />
          PURGE CACHED QUOTES
        </button>

        <button
          onClick={logout}
          className="w-full py-4 rounded-[18px] bg-white/[0.02] border border-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 text-[var(--text-secondary)] text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
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
          className="w-full py-4 rounded-[18px] bg-red-500/10 border border-red-500/15 hover:bg-red-500/20 text-red-400 text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <Trash2 className="w-4 h-4" />
          DELETE FINNHUB CREDENTIALS
        </button>
      </div>
    </div>
  );
};
