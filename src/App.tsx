/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Splash } from "./components/Splash";
import { Onboarding } from "./components/Onboarding";
import { Auth } from "./components/Auth";
import { BottomNav } from "./components/BottomNav";
import { SearchOverlay } from "./components/SearchOverlay";
import { AssetChart } from "./components/AssetChart";
import { HomeView } from "./components/HomeView";
import { MarketsView } from "./components/MarketsView";
import { NewsView } from "./components/NewsView";
import { AIChatView } from "./components/AIChatView";
import { ProfileView } from "./components/ProfileView";
import { NotificationsView } from "./components/NotificationsView";
import { FinScopeAPI } from "./services/api";
import { NewsItem } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { Star, X, Bell, Sparkles, MapPin, Building, Globe, Landmark, ShieldCheck, TrendingUp, AlertCircle, Bookmark, CheckCircle, ExternalLink } from "lucide-react";

const MainAppContent: React.FC = () => {
  const { user, watchlist, addToWatchlist, removeFromWatchlist, savedArticles, saveArticle, unsaveArticle, alerts, addPriceAlert, deleteAlert } = useApp();

  const [flow, setFlow] = useState<"splash" | "onboarding" | "auth" | "dashboard">("splash");
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Slide Overlays
  const [selectedAsset, setSelectedAsset] = useState<{ symbol: string; type: "stock" | "crypto" | "etf" } | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // States for live fetched data inside sheets
  const [assetQuote, setAssetQuote] = useState<any>(null);
  const [companyProfile, setCompanyProfile] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loadingAsset, setLoadingAsset] = useState(false);
  const [aiNewsSummary, setAiNewsSummary] = useState<string | null>(null);
  const [loadingNewsSummary, setLoadingNewsSummary] = useState(false);

  // Form states for new price alerts inside asset sheet
  const [alertPrice, setAlertPrice] = useState("");
  const [alertCondition, setAlertCondition] = useState<"above" | "below">("above");
  const [alertSuccess, setAlertSuccess] = useState(false);

  // Flow Controller Transitions
  useEffect(() => {
    if (flow === "splash") {
      // Automatic transition after Splash completes is handled by prop callback
    } else if (flow === "onboarding") {
      const onboarded = localStorage.getItem("finscope_onboarded");
      if (onboarded === "true") {
        setFlow(user ? "dashboard" : "auth");
      }
    } else {
      if (user) {
        setFlow("dashboard");
      } else {
        setFlow("auth");
      }
    }
  }, [user, flow]);

  // Load live Asset details whenever selectedAsset shifts
  useEffect(() => {
    if (!selectedAsset) {
      setAssetQuote(null);
      setCompanyProfile(null);
      setRecommendations(null);
      setAlertSuccess(false);
      setAlertPrice("");
      return;
    }

    const fetchAssetSpecs = async () => {
      setLoadingAsset(true);
      try {
        const [quote, profile, recom] = await Promise.all([
          FinScopeAPI.getQuote(selectedAsset.symbol),
          FinScopeAPI.getCompanyProfile(selectedAsset.symbol),
          FinScopeAPI.getRecommendations(selectedAsset.symbol)
        ]);
        setAssetQuote(quote);
        setCompanyProfile(profile);
        setRecommendations(recom);
        
        // Default suggested alert price
        if (quote) {
          setAlertPrice(quote.price.toFixed(2));
        }
      } catch (err) {
        console.error("Failed to load asset details sheet:", err);
      } finally {
        setLoadingAsset(false);
      }
    };

    fetchAssetSpecs();
  }, [selectedAsset]);

  // Summarize News story whenever details modal opens
  useEffect(() => {
    if (!selectedNews) {
      setAiNewsSummary(null);
      return;
    }

    const fetchAiSummary = async () => {
      setLoadingNewsSummary(true);
      try {
        const sum = await FinScopeAPI.summarizeArticle(selectedNews.headline, selectedNews.summary);
        setAiNewsSummary(sum);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingNewsSummary(false);
      }
    };

    fetchAiSummary();
  }, [selectedNews]);

  const handleCreatePriceAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset || !alertPrice) return;
    const priceVal = parseFloat(alertPrice);
    if (isNaN(priceVal)) return;

    addPriceAlert(
      selectedAsset.symbol,
      companyProfile?.name || selectedAsset.symbol,
      priceVal,
      alertCondition,
      "price"
    );
    setAlertSuccess(true);
    setTimeout(() => setAlertSuccess(false), 2500);
  };

  const isWatch = selectedAsset ? watchlist.some(w => w.symbol === selectedAsset.symbol) : false;

  const handleToggleWatchFromDetails = () => {
    if (!selectedAsset) return;
    if (isWatch) {
      removeFromWatchlist(selectedAsset.symbol);
    } else {
      addToWatchlist(selectedAsset.symbol, companyProfile?.name || selectedAsset.symbol, selectedAsset.type);
    }
  };

  return (
    <div className="min-h-screen bg-[#071C16] text-white overflow-x-hidden relative selection:bg-[#B6FF5A] selection:text-[#071C16]">
      <AnimatePresence mode="wait">
        {/* FLOW 1: SPLASH */}
        {flow === "splash" && (
          <Splash
            key="splash"
            onComplete={() => {
              const onboarded = localStorage.getItem("finscope_onboarded");
              if (onboarded === "true") {
                setFlow(user ? "dashboard" : "auth");
              } else {
                setFlow("onboarding");
              }
            }}
          />
        )}

        {/* FLOW 2: ONBOARDING */}
        {flow === "onboarding" && (
          <Onboarding
            key="onboarding"
            onComplete={() => {
              localStorage.setItem("finscope_onboarded", "true");
              setFlow(user ? "dashboard" : "auth");
            }}
          />
        )}

        {/* FLOW 3: AUTHENTICATION */}
        {flow === "auth" && (
          <Auth key="auth" />
        )}

        {/* FLOW 4: PRIMARY DASHBOARD */}
        {flow === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full min-h-screen"
          >
            {/* Navigated Subview wrapper */}
            <div className="max-w-2xl mx-auto w-full relative">
              {isNotificationsOpen ? (
                <NotificationsView onBack={() => setIsNotificationsOpen(false)} />
              ) : (
                <>
                  {activeTab === "home" && (
                    <HomeView
                      onSearchOpen={() => setIsSearchOpen(true)}
                      onSelectAsset={(sym, ty) => setSelectedAsset({ symbol: sym, type: ty })}
                      onNavigateTab={(tab) => setActiveTab(tab)}
                      onShowNewsDetails={(art) => setSelectedNews(art)}
                      onNotificationsOpen={() => setIsNotificationsOpen(true)}
                    />
                  )}

                  {activeTab === "markets" && (
                    <MarketsView
                      onSelectAsset={(sym, ty) => setSelectedAsset({ symbol: sym, type: ty })}
                    />
                  )}

                  {activeTab === "news" && (
                    <NewsView
                      onShowNewsDetails={(art) => setSelectedNews(art)}
                    />
                  )}

                  {activeTab === "ai" && <AIChatView />}

                  {activeTab === "profile" && <ProfileView />}
                </>
              )}
            </div>

            {/* Bottom Navigator */}
            {!isNotificationsOpen && (
              <BottomNav
                activeTab={activeTab}
                onChangeTab={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FLOATING OVERLAYS & SHEETS --- */}

      {/* 1. Global Search panel overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <SearchOverlay
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectAsset={(sym, ty) => setSelectedAsset({ symbol: sym, type: ty })}
          />
        )}
      </AnimatePresence>

      {/* 2. Asset Details Sliding bottom-sheet drawer */}
      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            {/* Backdrop click closer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAsset(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* The Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-xl mx-auto bg-[#0D2B22] border-t border-white/10 rounded-t-[32px] p-6 max-h-[90vh] overflow-y-auto z-10 shadow-2xl pb-16"
              id="details-sheet"
            >
              {/* Drag bar indicator */}
              <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-6 pointer-events-none" />

              {/* Top Row with closer & watchlist toggle */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#163A2D] rounded-2xl border border-white/5 font-bold font-mono text-[#B6FF5A] text-xs">
                    {selectedAsset.symbol}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white tracking-tight">{companyProfile?.name || selectedAsset.symbol}</h2>
                    <p className="text-[10px] text-[#A6B0AA] uppercase tracking-widest font-mono mt-0.5">{selectedAsset.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleWatchFromDetails}
                    className={`p-3 rounded-2xl border transition-all ${
                      isWatch
                        ? "bg-[#B6FF5A]/10 border-[#B6FF5A]/20 text-[#B6FF5A]"
                        : "bg-white/5 border-white/5 text-[#A6B0AA] hover:text-white"
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                  <button
                    onClick={() => setSelectedAsset(null)}
                    className="p-3 rounded-2xl bg-white/5 border border-white/5 text-[#A6B0AA] hover:text-white transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Asset Chart panel */}
              <div className="bg-[#163A2D]/40 border border-white/5 rounded-3xl p-5 mb-6">
                {loadingAsset ? (
                  <div className="h-44 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-[#B6FF5A] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  assetQuote && (
                    <AssetChart
                      data={assetQuote.history1D}
                      symbol={selectedAsset.symbol}
                      height={160}
                    />
                  )
                )}
              </div>

              {/* Valuation stats grid */}
              {assetQuote && (
                <div className="grid grid-cols-4 gap-2 mb-6 text-center">
                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-[9px] font-mono uppercase tracking-wide text-[#A6B0AA]">High</span>
                    <p className="text-xs font-bold font-mono text-white mt-1">${assetQuote.high.toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-[9px] font-mono uppercase tracking-wide text-[#A6B0AA]">Low</span>
                    <p className="text-xs font-bold font-mono text-white mt-1">${assetQuote.low.toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-[9px] font-mono uppercase tracking-wide text-[#A6B0AA]">Open</span>
                    <p className="text-xs font-bold font-mono text-white mt-1">${assetQuote.open.toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-[9px] font-mono uppercase tracking-wide text-[#A6B0AA]">Close</span>
                    <p className="text-xs font-bold font-mono text-white mt-1">${assetQuote.prevClose.toFixed(2)}</p>
                  </div>
                </div>
              )}

              {/* Set custom alert panel */}
              <div className="bg-[#163A2D]/20 border border-white/5 rounded-3xl p-5 mb-6">
                <h3 className="text-xs font-mono tracking-widest text-[#A6B0AA] uppercase mb-4 flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-[#B6FF5A]" />
                  Add Target Threshold Alert
                </h3>
                
                {alertSuccess ? (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-2 bg-[#92FF5A]/10 border border-[#92FF5A]/20 p-4 rounded-2xl text-xs text-white"
                  >
                    <CheckCircle className="w-5 h-5 text-[#92FF5A]" />
                    Target threshold alert compiled successfully!
                  </motion.div>
                ) : (
                  <form onSubmit={handleCreatePriceAlert} className="flex gap-2 items-center">
                    {/* Condition toggle selector */}
                    <button
                      type="button"
                      onClick={() => setAlertCondition(alertCondition === "above" ? "below" : "above")}
                      className="px-3.5 py-3 rounded-xl bg-[#163A2D] text-[10px] font-bold uppercase border border-white/5 text-[#B6FF5A] tracking-wider"
                    >
                      {alertCondition === "above" ? "Goes Above" : "Goes Below"}
                    </button>
                    
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#A6B0AA]">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={alertPrice}
                        onChange={(e) => setAlertPrice(e.target.value)}
                        placeholder="Target Price"
                        className="w-full pl-7 pr-3 py-3 rounded-xl bg-[#163A2D] border border-white/5 focus:border-[#B6FF5A]/20 outline-none text-xs font-mono text-white"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="py-3 px-4 rounded-xl bg-[#A6FF4D] hover:bg-[#B6FF5A] text-[#071C16] text-xs font-bold transition-all"
                    >
                      SET ALERT
                    </button>
                  </form>
                )}
              </div>

              {/* Analyst Ratings panel */}
              {recommendations && (
                <div className="bg-[#163A2D]/20 border border-white/5 rounded-3xl p-5 mb-6">
                  <h3 className="text-xs font-mono tracking-widest text-[#A6B0AA] uppercase mb-4 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[#B6FF5A]" />
                    Analyst Recommendations Consensus
                  </h3>

                  {/* Recommendation Bar Chart gauge representation */}
                  <div className="space-y-3">
                    <div className="flex h-5 rounded-lg overflow-hidden border border-white/5">
                      <div className="bg-emerald-500 flex items-center justify-center text-[9px] font-bold text-white" style={{ width: `${(recommendations.strongBuy / 40) * 100}%` }}>
                        {recommendations.strongBuy > 0 && "Buy"}
                      </div>
                      <div className="bg-emerald-400 flex items-center justify-center text-[9px] font-bold text-white" style={{ width: `${(recommendations.buy / 40) * 100}%` }}>
                      </div>
                      <div className="bg-amber-400 flex items-center justify-center text-[9px] font-bold text-white" style={{ width: `${(recommendations.hold / 40) * 100}%` }}>
                        {recommendations.hold > 0 && "Hold"}
                      </div>
                      <div className="bg-red-500 flex items-center justify-center text-[9px] font-bold text-white" style={{ width: `${(recommendations.sell / 40) * 100}%` }}>
                        {recommendations.sell > 0 && "Sell"}
                      </div>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-[#A6B0AA]">
                      <span>Strong Buy: {recommendations.strongBuy}</span>
                      <span>Buy: {recommendations.buy}</span>
                      <span>Hold: {recommendations.hold}</span>
                      <span>Sell: {recommendations.sell}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Corporate Profiles descriptions */}
              {companyProfile && (
                <div className="space-y-4">
                  <h3 className="text-xs font-mono tracking-widest text-[#A6B0AA] uppercase border-b border-white/5 pb-2">
                    Company Profile
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-[#A6B0AA]">
                      <Landmark className="w-4 h-4 text-[#B6FF5A]" />
                      <span>Industry: <strong className="text-white font-medium">{companyProfile.industry}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-[#A6B0AA]">
                      <Building className="w-4 h-4 text-[#B6FF5A]" />
                      <span>CEO: <strong className="text-white font-medium">{companyProfile.ceo}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-[#A6B0AA]">
                      <MapPin className="w-4 h-4 text-[#B6FF5A]" />
                      <span>Headquarters: <strong className="text-white font-medium">{companyProfile.headquarters}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-[#A6B0AA]">
                      <Globe className="w-4 h-4 text-[#B6FF5A]" />
                      <a href={companyProfile.weburl} target="_blank" rel="noreferrer" className="text-white hover:text-[#B6FF5A] flex items-center gap-1 font-medium hover:underline">
                        Visit Website
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <p className="text-xs text-[#A6B0AA] leading-relaxed mt-4">
                    {companyProfile.name} is a global leader in {companyProfile.industry.toLowerCase()} technologies. Headquartered in {companyProfile.headquarters}, it is monitored closely by equity research networks for high-volume allocation trends.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. News Details Sliding bottom-sheet drawer */}
      <AnimatePresence>
        {selectedNews && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNews(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-xl mx-auto bg-[#0D2B22] border-t border-white/10 rounded-t-[32px] p-6 max-h-[85vh] overflow-y-auto z-10 shadow-2xl pb-16"
              id="news-sheet"
            >
              <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-6" />

              {/* Close Button Header */}
              <div className="flex justify-between items-center mb-4">
                <span className="bg-[#B6FF5A] text-[#071C16] text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                  {selectedNews.category}
                </span>
                <button
                  onClick={() => setSelectedNews(null)}
                  className="p-3 rounded-2xl bg-white/5 border border-white/5 text-[#A6B0AA]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* News Hero Image */}
              <div className="h-48 rounded-2xl overflow-hidden mb-6">
                <img src={selectedNews.image} alt={selectedNews.headline} className="w-full h-full object-cover" />
              </div>

              {/* Headings */}
              <h1 className="text-lg font-bold text-white mb-2 leading-snug">{selectedNews.headline}</h1>
              
              <div className="flex items-center gap-3 text-[10px] text-[#A6B0AA] font-mono mb-6 pb-4 border-b border-white/5">
                <span>{selectedNews.source}</span>
                <span>•</span>
                <span>{selectedNews.readTime || "3m read"}</span>
              </div>

              {/* Gemini AI Summary Segment */}
              <div className="bg-[#163A2D] border border-[#B6FF5A]/20 rounded-3xl p-5 mb-6 relative overflow-hidden">
                <h3 className="text-xs font-mono font-bold text-[#B6FF5A] uppercase mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  FinScope AI Intelligence briefing
                </h3>

                {loadingNewsSummary ? (
                  <div className="py-4 flex flex-col gap-2">
                    <div className="h-3 w-4/5 bg-white/5 rounded animate-pulse" />
                    <div className="h-3 w-11/12 bg-white/5 rounded animate-pulse" />
                    <div className="h-3 w-3/4 bg-white/5 rounded animate-pulse" />
                  </div>
                ) : (
                  <p className="text-xs text-[#A6B0AA] leading-relaxed">
                    {aiNewsSummary}
                  </p>
                )}
              </div>

              {/* Original Summary text details */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono tracking-widest text-[#A6B0AA] uppercase">
                  Original Press Release Summary
                </h3>
                <p className="text-xs text-[#A6B0AA] leading-relaxed">
                  {selectedNews.summary || "Full details of this market announcement are being synchronized. Please monitor active regulatory filings."}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
