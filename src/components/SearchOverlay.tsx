/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Search, X, TrendingUp, History, Briefcase } from "lucide-react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (symbol: string, type: "stock" | "crypto" | "etf") => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, onSelectAsset }) => {
  const { recentSearches, addSearchQuery, clearSearchHistory } = useApp();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | "stock" | "crypto" | "etf">("all");

  if (!isOpen) return null;

  // Fully searchable asset registry matching our fallback & mock states
  const ALL_ASSETS = [
    { symbol: "AAPL", name: "Apple Inc.", type: "stock", price: "$182.52" },
    { symbol: "MSFT", name: "Microsoft Corporation", type: "stock", price: "$421.90" },
    { symbol: "NVDA", name: "NVIDIA Corporation", type: "stock", price: "$948.22" },
    { symbol: "TSLA", name: "Tesla Inc.", type: "stock", price: "$178.20" },
    { symbol: "AMZN", name: "Amazon.com, Inc.", type: "stock", price: "$180.12" },
    { symbol: "BTC", name: "Bitcoin", type: "crypto", price: "$67,450.00" },
    { symbol: "ETH", name: "Ethereum", type: "crypto", price: "$3,485.20" },
    { symbol: "SOL", name: "Solana", type: "crypto", price: "$135.45" },
    { symbol: "XRP", name: "Ripple", type: "crypto", price: "$0.524" },
    { symbol: "DOGE", name: "Dogecoin", type: "crypto", price: "$0.128" },
    { symbol: "SPY", name: "SPDR S&P 500 ETF Trust", type: "etf", price: "$522.20" },
    { symbol: "QQQ", name: "Invesco QQQ Trust", type: "etf", price: "$442.85" },
    { symbol: "VOO", name: "Vanguard S&P 500 ETF", type: "etf", price: "$479.50" },
    { symbol: "ARKK", name: "ARK Innovation ETF", type: "etf", price: "$43.15" }
  ] as const;

  const filteredAssets = ALL_ASSETS.filter((asset) => {
    const matchesQuery = 
      asset.symbol.toLowerCase().includes(query.toLowerCase()) ||
      asset.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "all" || asset.type === category;
    return matchesQuery && matchesCategory;
  });

  const TRENDING_SEARCHES = [
    { symbol: "NVDA", name: "NVIDIA Corp.", type: "stock" },
    { symbol: "BTC", name: "Bitcoin", type: "crypto" },
    { symbol: "QQQ", name: "Invesco QQQ Trust", type: "etf" }
  ] as const;

  const handleSelect = (symbol: string, type: "stock" | "crypto" | "etf") => {
    addSearchQuery(symbol, type);
    onSelectAsset(symbol, type);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-brand-primary/95 backdrop-blur-md flex flex-col p-6"
    >
      {/* Top Search bar input */}
      <div className="flex items-center gap-4 max-w-2xl mx-auto w-full mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
          <input
            type="text"
            placeholder="Search stocks, crypto, ETFs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-4 rounded-2xl bg-brand-card border border-brand-text-primary/5 focus:border-brand-accent/30 outline-none text-brand-text-primary text-sm"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-brand-text-secondary hover:text-brand-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-3.5 rounded-2xl bg-brand-text-primary/5 border border-brand-text-primary/5 hover:bg-white/10 text-brand-text-secondary hover:text-brand-text-primary transition-all text-xs font-bold"
        >
          CLOSE
        </button>
      </div>

      {/* Categories chips filter */}
      <div className="flex gap-2 max-w-2xl mx-auto w-full overflow-x-auto pb-4 border-b border-brand-text-primary/5 mb-6">
        {(["all", "stock", "crypto", "etf"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all ${
              category === cat
                ? "bg-brand-btn-accent text-brand-primary"
                : "bg-brand-card/50 text-brand-text-secondary border border-brand-text-primary/5 hover:text-brand-text-primary"
            }`}
          >
            {cat === "all" ? "ALL ASSETS" : cat + "S"}
          </button>
        ))}
      </div>

      {/* Main Results grid */}
      <div className="flex-1 max-w-2xl mx-auto w-full overflow-y-auto space-y-6">
        {query.trim() === "" ? (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs uppercase font-mono tracking-widest text-brand-text-secondary flex items-center gap-2">
                    <History className="w-3.5 h-3.5" />
                    RECENT SEARCHES
                  </h3>
                  <button
                    onClick={clearSearchHistory}
                    className="text-[10px] text-brand-text-secondary hover:text-brand-chart-red hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {recentSearches.map((search) => (
                    <button
                      key={search.id}
                      onClick={() => handleSelect(search.query, search.type as any)}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-brand-card/40 border border-brand-text-primary/5 text-left hover:border-brand-accent/20 transition-all duration-200 ease-out"
                    >
                      <span className="text-xs font-bold text-brand-text-primary font-mono">{search.query}</span>
                      <span className="text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-brand-text-primary/5 text-brand-text-secondary ml-auto font-mono">
                        {search.type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            <div>
              <h3 className="text-xs uppercase font-mono tracking-widest text-brand-text-secondary mb-3 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-brand-accent" />
                TRENDING NOW
              </h3>
              <div className="space-y-2">
                {TRENDING_SEARCHES.map((trend) => (
                  <button
                    key={trend.symbol}
                    onClick={() => handleSelect(trend.symbol, trend.type)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-brand-card/30 border border-brand-text-primary/5 hover:bg-brand-card/50 transition-all text-left"
                  >
                    <div>
                      <p className="text-sm font-bold font-mono text-brand-text-primary">{trend.symbol}</p>
                      <p className="text-xs text-brand-text-secondary">{trend.name}</p>
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 rounded bg-brand-accent/10 text-brand-accent">
                      {trend.type}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Live Results list */
          <div>
            <h3 className="text-xs uppercase font-mono tracking-widest text-brand-text-secondary mb-3 flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5" />
              MATCHING RESULTS ({filteredAssets.length})
            </h3>
            {filteredAssets.length > 0 ? (
              <div className="space-y-2">
                {filteredAssets.map((asset) => (
                  <button
                    key={asset.symbol}
                    onClick={() => handleSelect(asset.symbol, asset.type)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-brand-card/40 border border-brand-text-primary/5 hover:border-brand-accent/30 transition-all text-left"
                  >
                    <div>
                      <span className="text-xs font-bold font-mono bg-brand-text-primary/5 px-2 py-0.5 rounded text-brand-accent mr-2">
                        {asset.symbol}
                      </span>
                      <span className="text-sm text-brand-text-primary font-medium">{asset.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold font-mono text-brand-text-primary">{asset.price}</p>
                      <p className="text-[9px] uppercase tracking-widest font-mono text-brand-text-secondary">{asset.type}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-brand-text-secondary">No assets found matching "{query}"</p>
                <p className="text-xs text-brand-text-secondary/60 mt-1">Check the spelling or try searching and typing another ticker.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
