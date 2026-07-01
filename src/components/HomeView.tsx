/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { FinScopeAPI } from "../services/api";
import { MarketIndex, NewsItem, StockQuote } from "../types";
import { MARKET_MOVERS, MARKET_HEATMAP } from "../data";
import { Search, Bell, Cpu, ArrowUpRight, ArrowDownRight, TrendingUp, Compass, Bookmark, Share2, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

interface HomeViewProps {
  onSearchOpen: () => void;
  onSelectAsset: (symbol: string, type: "stock" | "crypto" | "etf") => void;
  onNavigateTab: (tab: string) => void;
  onShowNewsDetails: (article: NewsItem) => void;
  onNotificationsOpen: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSearchOpen,
  onSelectAsset,
  onNavigateTab,
  onShowNewsDetails,
  onNotificationsOpen
}) => {
  const { user, watchlist, saveArticle, savedArticles, notifications, addNotification } = useApp();
  
  const [indexes, setIndexes] = useState<MarketIndex[]>([]);
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [moversTab, setMoversTab] = useState<"gainers" | "losers" | "active">("gainers");
  const [loading, setLoading] = useState(true);
  const [summarizingId, setSummarizingId] = useState<string | null>(null);
  const [activeSummary, setActiveSummary] = useState<{ id: string; text: string } | null>(null);

  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  const loadHomeData = async () => {
    setLoading(true);
    try {
      const [idxData, stockData, newsData] = await Promise.all([
        FinScopeAPI.getIndexes(),
        FinScopeAPI.getStocks(),
        FinScopeAPI.getNews()
      ]);
      setIndexes(idxData);
      setStocks(stockData);
      setNews(newsData);
    } catch (e) {
      console.error("Failed to load home view feeds:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const handleAISummarize = async (e: React.MouseEvent, article: NewsItem) => {
    e.stopPropagation(); // Avoid triggering open article
    setSummarizingId(article.id);
    try {
      const summary = await FinScopeAPI.summarizeArticle(article.headline, article.summary);
      setActiveSummary({ id: article.id, text: summary });
    } catch (err) {
      console.error(err);
    } finally {
      setSummarizingId(null);
    }
  };

  const handleSaveArticle = (e: React.MouseEvent, article: NewsItem) => {
    e.stopPropagation();
    saveArticle(article);
  };

  // Quick Action Keys Configuration
  const quickActions = [
    { label: "Watchlist", icon: Compass, tab: "markets" },
    { label: "Markets", icon: TrendingUp, tab: "markets" },
    { label: "AI Advisor", icon: Cpu, tab: "ai" },
    { label: "News Feed", icon: Bookmark, tab: "news" },
  ];

  return (
    <div className="flex flex-col pb-32">
      {/* 1. Header with greeting and utilities */}
      <div className="flex items-center justify-between mb-8 px-4 pt-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[var(--bg-card)] to-[var(--accent)] p-[2px] shadow-md shrink-0">
            <div className="w-full h-full rounded-full bg-[var(--bg-primary)] flex items-center justify-center overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-xs font-bold text-[var(--accent)] font-mono">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : "IP"}
                </span>
              )}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[var(--text-secondary)] uppercase font-semibold block mb-0.5">PORTFOLIO INTELLIGENCE</span>
            <h1 className="font-display text-lg font-black text-[var(--text-primary)] tracking-tight leading-tight" id="home-greeting">
              Good Morning, <span className="text-[var(--accent)]">{user?.name || "Investor"}</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          {/* Search Trigger */}
          <button
            onClick={onSearchOpen}
            className="p-3.5 rounded-[18px] bg-[var(--bg-card)] border border-white/5 hover:border-[var(--accent)]/50 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all active:scale-95 shadow-lg cursor-pointer"
            id="home-search-btn"
          >
            <Search className="w-4 h-4" />
          </button>
          
          {/* Notifications bell */}
          <button
            onClick={onNotificationsOpen}
            className="p-3.5 rounded-[18px] bg-[var(--bg-card)] border border-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all active:scale-95 relative shadow-lg cursor-pointer"
            id="home-bell-btn"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border border-[var(--bg-primary)] rounded-full animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Hero Card holding market index scroll banner */}
      <div className="px-4 mb-8">
        <div className="glass-panel rounded-[24px] p-6 relative overflow-hidden shadow-2xl">
          {/* Ambient vector detail graph from Immersive UI design */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.08] pointer-events-none">
            <svg viewBox="0 0 400 200" className="w-full h-full text-[var(--accent)]" preserveAspectRatio="none">
              <path d="M0,150 Q100,140 150,100 T300,80 T400,20" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
          </div>
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-xs font-mono tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
              GLOBAL INDICES TIMELINE
            </span>
            <button onClick={loadHomeData} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1 bg-white/5 rounded-lg border border-white/5 cursor-pointer">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="min-w-[140px] h-20 bg-white/5 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar scroll-smooth relative z-10">
              {indexes.map((idx) => {
                const positive = idx.change >= 0;
                return (
                  <div
                    key={idx.symbol}
                    className="min-w-[155px] flex-1 p-4 rounded-[18px] bg-[var(--bg-primary)]/40 backdrop-blur-sm border border-white/5 hover:border-[var(--accent)]/30 transition-all cursor-pointer shadow-sm"
                    onClick={() => onSelectAsset(idx.symbol, idx.symbol.includes("BTC") ? "crypto" : "stock")}
                  >
                    <p className="text-[11px] text-[var(--text-secondary)] font-bold uppercase tracking-wider">{idx.name}</p>
                    <p className="text-base font-black font-mono mt-1.5 text-[var(--text-primary)]">${idx.price.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] font-mono">
                      {positive ? <ArrowUpRight className="w-3 h-3 text-[var(--chart-green,rgba(34,197,94,1))]" /> : <ArrowDownRight className="w-3 h-3 text-[var(--chart-red,rgba(239,68,68,1))]" />}
                      <span className={positive ? "text-[var(--chart-green,rgba(34,197,94,1))] font-bold" : "text-[var(--chart-red,rgba(239,68,68,1))] font-bold"}>
                        {positive ? "+" : ""}{idx.changePercent}%
                      </span>
                    </div>

                    {/* Micro Sparkline */}
                    <svg className="w-full h-6 mt-3 overflow-visible opacity-70" viewBox="0 0 100 20">
                      <path
                        d={`M 0,${15 - (idx.history[0] - Math.min(...idx.history)) / (Math.max(...idx.history) - Math.min(...idx.history) || 1) * 12} ` +
                          idx.history.map((h, i) => `L ${(i / (idx.history.length - 1)) * 100},${15 - (h - Math.min(...idx.history)) / (Math.max(...idx.history) - Math.min(...idx.history) || 1) * 12}`).join(" ")}
                        fill="none"
                        stroke={positive ? "var(--accent)" : "var(--chart-red,rgba(239,68,68,1))"}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 3. Quick Actions row */}
      <div className="px-4 mb-8">
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.label}
                onClick={() => onNavigateTab(act.tab)}
                className="flex flex-col items-center justify-center p-4 rounded-[18px] bg-[var(--bg-card)]/50 backdrop-blur-md border border-white/5 hover:border-[var(--accent)]/40 hover:bg-[var(--bg-card)] shadow-lg transition-all active:scale-95 group cursor-pointer"
                id={`btn-action-${act.label.toLowerCase().replace(" ", "-")}`}
              >
                <div className="p-3 rounded-xl bg-white/5 mb-2 group-hover:bg-[var(--accent)]/10 group-hover:text-[var(--accent)] transition-colors border border-white/5 group-hover:border-[var(--accent)]/20">
                  <Icon className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" />
                </div>
                <span className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-wider group-hover:text-[var(--text-primary)] transition-colors">{act.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Watchlist Snapshot Preview */}
      <div className="px-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-display font-bold uppercase tracking-widest text-[var(--text-primary)] flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[var(--accent)]" />
            Your Watchlist Snapshot
          </h2>
          <button onClick={() => onNavigateTab("markets")} className="text-xs text-[var(--accent)] font-bold hover:underline transition-all cursor-pointer">
            View All
          </button>
        </div>
        {watchlist.length > 0 ? (
          <div className="grid gap-3">
            {watchlist.slice(0, 3).map((item) => {
              const mockStock = stocks.find(s => s.symbol === item.symbol);
              const price = mockStock ? mockStock.price : 145.00;
              const change = mockStock ? mockStock.changePercent : 1.25;
              const isPos = change >= 0;
              
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectAsset(item.symbol, item.type)}
                  className="flex items-center justify-between p-4 rounded-[18px] bg-gradient-to-r from-[var(--bg-card)]/80 to-[var(--bg-secondary)]/80 border border-white/5 hover:border-[var(--accent)]/40 shadow-lg hover:translate-x-1 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black font-mono bg-[var(--accent)]/15 border border-[var(--accent)]/20 text-[var(--accent)] px-2.5 py-1 rounded-[8px]">
                      {item.symbol}
                    </span>
                    <div>
                      <p className="text-xs text-[var(--text-primary)] font-bold leading-none">{item.name}</p>
                      <p className="text-[10px] text-[var(--text-secondary)] uppercase font-mono tracking-wider mt-1">{item.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black font-mono text-[var(--text-primary)]">${price.toFixed(2)}</p>
                    <span className={`text-[10px] font-mono font-bold flex items-center justify-end gap-0.5 ${isPos ? "text-[var(--chart-green,rgba(34,197,94,1))]" : "text-[var(--chart-red,rgba(239,68,68,1))]"}`}>
                      {isPos ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {isPos ? "+" : ""}{change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-[var(--bg-card)]/20 rounded-[24px] border border-dashed border-white/10">
            <p className="text-xs text-[var(--text-secondary)]">No items in your watchlist.</p>
            <button onClick={onSearchOpen} className="text-xs text-[var(--accent)] font-bold mt-2 hover:underline cursor-pointer">
              Search Tickers to Add
            </button>
          </div>
        )}
      </div>

      {/* 5. Trending News Feed with instant AI summary */}
      <div className="px-4 mb-8">
        <h2 className="text-sm font-display font-bold uppercase tracking-widest text-[var(--text-primary)] mb-4 flex items-center gap-1.5">
          <Bookmark className="w-4 h-4 text-[var(--accent)]" />
          TRENDING NEWS BRIEFS
        </h2>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-28 bg-white/5 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {news.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => onShowNewsDetails(item)}
                className="bg-gradient-to-br from-[var(--bg-card)]/90 to-[var(--bg-secondary)]/90 backdrop-blur-md border border-white/5 rounded-[24px] overflow-hidden hover:border-[var(--accent)]/40 hover:shadow-2xl transition-all cursor-pointer group shadow-xl"
              >
                {/* News Thumbnail Card with absolute styling */}
                <div className="relative h-44 overflow-hidden">
                  <img src={item.image} alt={item.headline} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/20 to-transparent" />
                  <span className="absolute top-4 left-4 bg-[var(--accent)] text-[var(--bg-primary)] text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-[8px] shadow-lg">
                    {item.category}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)] mb-2 font-mono font-semibold">
                    <span>{item.source}</span>
                    <span>{item.readTime || "3m read"}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] leading-snug group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                    {item.headline}
                  </h3>

                  {/* Summary display if active */}
                  {activeSummary && activeSummary.id === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="mt-4 p-4 bg-[var(--bg-primary)]/80 rounded-[18px] border border-[var(--accent)]/25 text-xs text-[var(--text-secondary)] leading-relaxed shadow-inner"
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-[var(--accent)] font-black uppercase mb-1.5 font-mono tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        FinScope AI summary
                      </div>
                      {activeSummary.text}
                    </motion.div>
                  )}

                  {/* Summarize Action Buttons */}
                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                    <button
                      onClick={(e) => handleAISummarize(e, item)}
                      disabled={summarizingId === item.id}
                      className="flex items-center gap-1.5 text-xs text-[var(--accent)] font-black uppercase tracking-wider hover:text-[var(--accent-highlight)] transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      {summarizingId === item.id ? "Analyzing..." : "AI Summarize"}
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleSaveArticle(e, item)}
                        className={`p-2 rounded-xl border border-white/5 hover:bg-[var(--accent)]/15 hover:border-[var(--accent)]/30 hover:text-[var(--accent)] transition-all cursor-pointer ${
                          savedArticles.some(sa => sa.newsId === item.id) ? "text-[var(--accent)] bg-[var(--accent)]/10 border-[var(--accent)]/30" : "text-[var(--text-secondary)]"
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Market Movers Segment */}
      <div className="px-4 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-display font-bold uppercase tracking-widest text-[var(--text-primary)] flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
            Market Movers
          </h2>
          <div className="flex bg-[var(--bg-card)] rounded-[14px] p-1 border border-white/5 shadow-md">
            {(["gainers", "losers", "active"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setMoversTab(tab)}
                className={`px-3 py-1 rounded-[10px] text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  moversTab === tab ? "bg-[var(--accent)] text-[var(--bg-primary)] shadow-md" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[var(--bg-card)]/80 to-[var(--bg-secondary)]/80 border border-white/5 rounded-[24px] p-4 shadow-xl">
          <div className="space-y-3">
            {moversTab === "gainers" && MARKET_MOVERS.gainers.map((m) => (
              <div
                key={m.symbol}
                onClick={() => onSelectAsset(m.symbol, "stock")}
                className="flex items-center justify-between p-3.5 rounded-[16px] hover:bg-white/[0.04] transition-all cursor-pointer border border-transparent hover:border-white/5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black font-mono text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/25 px-2.5 py-1 rounded-[6px]">
                    {m.symbol}
                  </span>
                  <span className="text-xs font-bold text-[var(--text-primary)]">{m.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black font-mono text-[var(--text-primary)]">${m.price.toFixed(2)}</p>
                  <p className="text-[10px] font-mono text-[var(--chart-green,rgba(34,197,94,1))] font-extrabold">+{m.changePercent}%</p>
                </div>
              </div>
            ))}

            {moversTab === "losers" && MARKET_MOVERS.losers.map((m) => (
              <div
                key={m.symbol}
                onClick={() => onSelectAsset(m.symbol, "stock")}
                className="flex items-center justify-between p-3.5 rounded-[16px] hover:bg-white/[0.04] transition-all cursor-pointer border border-transparent hover:border-white/5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black font-mono text-[var(--chart-red,rgba(239,68,68,1))] bg-[var(--chart-red,rgba(239,68,68,1))]/10 border border-[var(--chart-red,rgba(239,68,68,1))]/25 px-2.5 py-1 rounded-[6px]">
                    {m.symbol}
                  </span>
                  <span className="text-xs font-bold text-[var(--text-primary)]">{m.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black font-mono text-[var(--text-primary)]">${m.price.toFixed(2)}</p>
                  <p className="text-[10px] font-mono text-[var(--chart-red,rgba(239,68,68,1))] font-extrabold">{m.changePercent}%</p>
                </div>
              </div>
            ))}

            {moversTab === "active" && MARKET_MOVERS.active.map((m) => (
              <div
                key={m.symbol}
                onClick={() => onSelectAsset(m.symbol, "stock")}
                className="flex items-center justify-between p-3.5 rounded-[16px] hover:bg-white/[0.04] transition-all cursor-pointer border border-transparent hover:border-white/5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black font-mono text-[var(--text-primary)] bg-white/5 border border-white/10 px-2.5 py-1 rounded-[6px]">
                    {m.symbol}
                  </span>
                  <span className="text-xs font-bold text-[var(--text-primary)]">{m.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black font-mono text-[var(--text-primary)]">${m.price.toFixed(2)}</p>
                  <p className="text-[10px] font-mono text-[var(--text-secondary)] font-bold">Vol: {m.volume}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Sector Heatmap cards */}
      <div className="px-4">
        <h2 className="text-sm font-display font-bold uppercase tracking-widest text-[var(--text-primary)] mb-4 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-[var(--accent)]" />
          Market Heatmap Sectors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MARKET_HEATMAP.map((sec) => (
            <div key={sec.sector} className="p-5 rounded-[24px] bg-gradient-to-br from-[var(--bg-card)]/80 to-[var(--bg-secondary)]/80 border border-white/5 flex flex-col justify-between shadow-xl">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[var(--text-secondary)] mb-4 font-bold">{sec.sector}</span>
              <div className="flex gap-2.5">
                {sec.companies.map((co) => {
                  const positive = co.change >= 0;
                  return (
                    <div
                      key={co.symbol}
                      onClick={() => onSelectAsset(co.symbol, co.symbol === "BTC" || co.symbol === "ETH" ? "crypto" : "stock")}
                      className={`flex-1 p-3 rounded-[14px] text-center cursor-pointer transition-all hover:scale-105 shadow-sm ${
                        positive 
                          ? "bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/50" 
                          : "bg-red-500/10 border border-red-500/30 hover:border-red-500/50"
                      }`}
                    >
                      <p className="text-xs font-black font-mono text-[var(--text-primary)]">{co.symbol}</p>
                      <p className={`text-[10px] font-mono font-black mt-1 ${positive ? "text-[var(--chart-green,rgba(34,197,94,1))]" : "text-[var(--chart-red,rgba(239,68,68,1))]"}`}>
                        {positive ? "+" : ""}{co.change}%
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
