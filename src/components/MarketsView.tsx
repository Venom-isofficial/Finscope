/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { FinScopeAPI } from "../services/api";
import { StockQuote, CryptoItem, ETFItem } from "../types";
import { Search, Star, ArrowUpRight, ArrowDownRight, Award, Flame, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MarketsViewProps {
  onSelectAsset: (symbol: string, type: "stock" | "crypto" | "etf") => void;
}

export const MarketsView: React.FC<MarketsViewProps> = ({ onSelectAsset }) => {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useApp();
  
  const [activeTab, setActiveTab] = useState<"stocks" | "crypto" | "etfs" | "watchlist">("stocks");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // States
  const [stocks, setStocks] = useState<StockQuote[]>([]);
  const [crypto, setCrypto] = useState<CryptoItem[]>([]);
  const [etfs, setEtfs] = useState<ETFItem[]>([]);

  const loadMarketData = async () => {
    setLoading(true);
    try {
      const [stockData, cryptoData, etfData] = await Promise.all([
        FinScopeAPI.getStocks(),
        FinScopeAPI.getCrypto(),
        FinScopeAPI.getETFs()
      ]);
      setStocks(stockData);
      setCrypto(cryptoData);
      setEtfs(etfData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarketData();
  }, []);

  const handleToggleWatchlist = (e: React.MouseEvent, symbol: string, name: string, type: "stock" | "crypto" | "etf") => {
    e.stopPropagation();
    const isSaved = watchlist.some(w => w.symbol === symbol);
    if (isSaved) {
      removeFromWatchlist(symbol);
    } else {
      addToWatchlist(symbol, name, type);
    }
  };

  const isSymbolInWatchlist = (symbol: string) => {
    return watchlist.some(w => w.symbol === symbol);
  };

  return (
    <div className="flex flex-col pb-32 pt-6 px-4">
      {/* Search Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[var(--text-secondary)] uppercase font-semibold block mb-0.5">MARKETS HUB</span>
          <h1 className="font-display text-2xl font-black text-[var(--text-primary)] tracking-tight">Assets Explorer</h1>
        </div>
        <button onClick={loadMarketData} className="p-3.5 rounded-[18px] bg-[var(--bg-card)] border border-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]/50 transition-all shadow-lg cursor-pointer">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Internal Tab Filter Selector */}
      <div className="flex gap-2 overflow-x-auto pb-4 border-b border-white/5 mb-6 no-scrollbar">
        {[
          { id: "stocks", label: "STOCKS" },
          { id: "crypto", label: "CRYPTO" },
          { id: "etfs", label: "ETFS" },
          { id: "watchlist", label: "MY WATCHLIST" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setQuery(""); }}
            className={`px-4.5 py-3 rounded-[14px] text-xs font-black tracking-widest uppercase whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-[var(--accent)] text-[var(--bg-primary)] shadow-lg shadow-[var(--accent)]/10"
                : "bg-[var(--bg-card)]/70 border border-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-white/20"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Secondary Search Ticker Input */}
      {activeTab !== "watchlist" && (
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder={`Filter ${activeTab}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-[18px] bg-[var(--bg-card)]/80 border border-white/5 focus:border-[var(--accent)]/50 focus:bg-[var(--bg-card)] outline-none text-[var(--text-primary)] text-xs transition-all shadow-md placeholder-[var(--text-secondary)]/60"
          />
        </div>
      )}

      {/* Main Lists with sliding animation */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 bg-white/5 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {/* STOCKS LIST */}
            {activeTab === "stocks" && stocks
              .filter(s => s.symbol.includes(query.toUpperCase()) || s.symbol.toLowerCase().includes(query.toLowerCase()))
              .map((st) => {
                const positive = st.change >= 0;
                const isWatch = isSymbolInWatchlist(st.symbol);
                return (
                  <div
                    key={st.symbol}
                    onClick={() => onSelectAsset(st.symbol, "stock")}
                    className="flex items-center justify-between p-4 rounded-[20px] bg-gradient-to-r from-[var(--bg-card)]/80 to-[var(--bg-secondary)]/80 border border-white/5 hover:border-[var(--accent)]/40 shadow-lg hover:translate-x-1 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => handleToggleWatchlist(e, st.symbol, st.symbol + " Inc.", "stock")}
                        className={`p-2.5 rounded-[12px] border transition-all cursor-pointer ${
                          isWatch ? "bg-[var(--accent)]/15 border-[var(--accent)]/30 text-[var(--accent)]" : "bg-[var(--bg-card)] border border-white/5 text-[var(--text-secondary)]"
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <div>
                        <span className="text-xs font-black font-mono text-[var(--text-primary)]">
                          {st.symbol}
                        </span>
                        <p className="text-[10px] text-[var(--text-secondary)] mt-1 font-semibold uppercase tracking-wider">Stock Quote</p>
                      </div>
                    </div>

                    {/* Micro sparkline */}
                    <svg className="w-16 h-8 overflow-visible opacity-85" viewBox="0 0 100 20">
                      <path
                        d={`M 0,${15 - (st.history1D[0] - Math.min(...st.history1D)) / (Math.max(...st.history1D) - Math.min(...st.history1D) || 1) * 12} ` +
                          st.history1D.map((h, i) => `L ${(i / (st.history1D.length - 1)) * 100},${15 - (h - Math.min(...st.history1D)) / (Math.max(...st.history1D) - Math.min(...st.history1D) || 1) * 12}`).join(" ")}
                        fill="none"
                        stroke={positive ? "var(--accent)" : "var(--chart-red,rgba(239,68,68,1))"}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>

                    <div className="text-right">
                      <p className="text-xs font-black font-mono text-[var(--text-primary)]">${st.price.toFixed(2)}</p>
                      <span className={`text-[10px] font-mono font-bold flex items-center justify-end gap-0.5 ${positive ? "text-[var(--chart-green,rgba(34,197,94,1))]" : "text-[var(--chart-red,rgba(239,68,68,1))]"}`}>
                        {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {positive ? "+" : ""}{st.changePercent}%
                      </span>
                    </div>
                  </div>
                );
              })}

            {/* CRYPTO LIST */}
            {activeTab === "crypto" && crypto
              .filter(c => c.symbol.includes(query.toUpperCase()) || c.name.toLowerCase().includes(query.toLowerCase()))
              .map((cr) => {
                const positive = cr.change >= 0;
                const isWatch = isSymbolInWatchlist(cr.symbol);
                return (
                  <div
                    key={cr.symbol}
                    onClick={() => onSelectAsset(cr.symbol, "crypto")}
                    className="flex items-center justify-between p-4 rounded-[20px] bg-gradient-to-r from-[var(--bg-card)]/80 to-[var(--bg-secondary)]/80 border border-white/5 hover:border-[var(--accent)]/40 shadow-lg hover:translate-x-1 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => handleToggleWatchlist(e, cr.symbol, cr.name, "crypto")}
                        className={`p-2.5 rounded-[12px] border transition-all cursor-pointer ${
                          isWatch ? "bg-[var(--accent)]/15 border-[var(--accent)]/30 text-[var(--accent)]" : "bg-[var(--bg-card)] border border-white/5 text-[var(--text-secondary)]"
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <div>
                        <span className="text-xs font-black font-mono text-[var(--text-primary)]">
                          {cr.symbol}
                        </span>
                        <p className="text-[10px] text-[var(--text-secondary)] mt-1 font-semibold uppercase tracking-wider">{cr.name}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-black font-mono text-[var(--text-primary)]">${cr.price.toLocaleString()}</p>
                      <span className={`text-[10px] font-mono font-bold flex items-center justify-end gap-0.5 ${positive ? "text-[var(--chart-green,rgba(34,197,94,1))]" : "text-[var(--chart-red,rgba(239,68,68,1))]"}`}>
                        {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {positive ? "+" : ""}{cr.changePercent}%
                      </span>
                    </div>
                  </div>
                );
              })}

            {/* ETFS LIST */}
            {activeTab === "etfs" && etfs
              .filter(e => e.symbol.includes(query.toUpperCase()) || e.name.toLowerCase().includes(query.toLowerCase()))
              .map((et) => {
                const positive = et.changePercent >= 0;
                const isWatch = isSymbolInWatchlist(et.symbol);
                return (
                  <div
                    key={et.symbol}
                    onClick={() => onSelectAsset(et.symbol, "etf")}
                    className="p-4 rounded-[20px] bg-gradient-to-r from-[var(--bg-card)]/80 to-[var(--bg-secondary)]/80 border border-white/5 hover:border-[var(--accent)]/40 shadow-lg hover:translate-x-1 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => handleToggleWatchlist(e, et.symbol, et.name, "etf")}
                          className={`p-2.5 rounded-[12px] border transition-all cursor-pointer ${
                            isWatch ? "bg-[var(--accent)]/15 border-[var(--accent)]/30 text-[var(--accent)]" : "bg-[var(--bg-card)] border border-white/5 text-[var(--text-secondary)]"
                          }`}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <div>
                          <span className="text-xs font-black font-mono bg-[var(--accent)]/15 border border-[var(--accent)]/25 text-[var(--accent)] px-2.5 py-1 rounded-[8px]">
                            {et.symbol}
                          </span>
                          <span className="text-xs text-[var(--text-primary)] font-black ml-2">{et.name}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black font-mono text-[var(--text-primary)]">${et.price.toFixed(2)}</p>
                        <p className={`text-[10px] font-mono font-bold flex items-center justify-end gap-0.5 ${positive ? "text-[var(--chart-green,rgba(34,197,94,1))]" : "text-[var(--chart-red,rgba(239,68,68,1))]"}`}>
                          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {positive ? "+" : ""}{et.changePercent}%
                        </p>
                      </div>
                    </div>
                    {/* ETF Details details badge row */}
                    <div className="flex items-center gap-3 pt-3 border-t border-white/5 text-[9px] font-mono text-[var(--text-secondary)] font-bold">
                      <span className="flex items-center gap-1.5 bg-[var(--bg-primary)]/60 px-2 py-1 rounded-[6px] border border-white/5">
                        <Award className="w-3.5 h-3.5 text-[var(--accent)]" />
                        Risk: {et.risk}
                      </span>
                      <span>•</span>
                      <span className="bg-[var(--bg-primary)]/60 px-2 py-1 rounded-[6px] border border-white/5">Ratio: {et.expenseRatio}%</span>
                      <span>•</span>
                      <span className="text-[var(--chart-green,rgba(34,197,94,1))] bg-[var(--chart-green,rgba(34,197,94,1))]/10 px-2 py-1 rounded-[6px] border border-[var(--chart-green,rgba(34,197,94,1))]/20 font-black">1Y: {et.performance1Y}%</span>
                    </div>
                  </div>
                );
              })}

            {/* WATCHLIST LIST */}
            {activeTab === "watchlist" && (
              watchlist.length > 0 ? (
                watchlist.map((item) => {
                  // Attempt to find current pricing matching watchlisted items
                  const mockQuote = stocks.find(s => s.symbol === item.symbol) || 
                                    crypto.find(c => c.symbol === item.symbol) ||
                                    etfs.find(e => e.symbol === item.symbol);
                  const priceVal = mockQuote ? mockQuote.price : 145.00;
                  const positive = mockQuote ? (mockQuote as any).changePercent >= 0 : true;
                  const changePct = mockQuote ? (mockQuote as any).changePercent : 0.00;

                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectAsset(item.symbol, item.type)}
                      className="flex items-center justify-between p-4 rounded-[20px] bg-gradient-to-r from-[var(--bg-card)]/80 to-[var(--bg-secondary)]/80 border border-white/5 hover:border-[var(--accent)]/40 shadow-lg hover:translate-x-1 transition-all cursor-pointer relative overflow-hidden"
                    >
                      {/* Swipe / Delete styling details */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFromWatchlist(item.symbol); }}
                          className="p-2.5 rounded-[12px] bg-red-500/10 text-red-400 border border-red-500/15 hover:bg-red-500/20 transition-all cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <div>
                          <span className="text-xs font-black font-mono text-[var(--text-primary)]">
                            {item.symbol}
                          </span>
                          <p className="text-[10px] text-[var(--text-secondary)] mt-1 font-bold uppercase tracking-wider">{item.name}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-black font-mono text-[var(--text-primary)]">${priceVal.toLocaleString()}</p>
                        <p className={`text-[10px] font-mono font-bold flex items-center justify-end gap-0.5 ${positive ? "text-[var(--chart-green,rgba(34,197,94,1))]" : "text-[var(--chart-red,rgba(239,68,68,1))]"}`}>
                          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {positive ? "+" : ""}{changePct.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-[var(--bg-card)]/40 to-[var(--bg-secondary)]/40 rounded-[24px] border border-dashed border-white/10 p-6 shadow-md">
                  <Star className="w-8 h-8 text-[var(--accent)]/60 mx-auto mb-3 animate-pulse" />
                  <p className="text-sm text-[var(--text-primary)] font-bold">Your Watchlist is empty</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xs mx-auto leading-relaxed">
                    Explore lists and click the star buttons to pin assets directly to your home snapshot.
                  </p>
                </div>
              )
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
