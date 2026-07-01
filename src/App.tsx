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
import { Star, X, Bell, Sparkles, MapPin, Building, Globe, Landmark, ShieldCheck, TrendingUp, AlertCircle, Bookmark, CheckCircle, ExternalLink, Home, BarChart2, Newspaper, Cpu, User, Compass } from "lucide-react";

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
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-x-hidden relative selection:bg-[var(--accent)] selection:text-[var(--bg-primary)] transition-colors duration-500">
      {/* Global Animated Watery Background Layer */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-[var(--accent)] opacity-[0.06] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[65%] h-[65%] rounded-full bg-[var(--accent)] opacity-[0.05] blur-[140px]" />
        <div className="absolute top-[30%] right-[15%] w-[45%] h-[45%] rounded-full bg-[var(--bg-card)] opacity-[0.14] blur-[100px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[50%] h-[50%] rounded-full bg-[var(--bg-secondary)] opacity-[0.12] blur-[110px]" />
      </div>

      
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
          <div
            key="dashboard" className="w-full min-h-screen flex flex-col md:flex-row bg-transparent relative z-10"
          >
            {/* Desktop Left Sidebar Navigation - Hidden on mobile */}
            <div className="hidden md:flex md:w-64 lg:w-72 shrink-0 flex-col bg-[var(--bg-secondary)]/30 backdrop-blur-xl border-r border-white/5 p-6 h-screen sticky top-0 justify-between">
              <div className="flex flex-col">
                {/* Logo or Brand */}
                <div className="flex items-center gap-3 mb-8 px-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--bg-card)] to-[var(--accent)] p-[2px] shadow-md flex items-center justify-center shrink-0">
                    <div className="w-full h-full rounded-lg bg-[var(--bg-primary)] flex items-center justify-center font-bold text-[var(--accent)] font-display">
                      FS
                    </div>
                  </div>
                  <div>
                    <h2 className="text-[var(--text-primary)] font-display font-black text-sm uppercase tracking-wider leading-none">FinScope</h2>
                    <span className="text-[8px] font-mono tracking-widest text-[var(--text-secondary)]/70 block mt-1 uppercase font-black">AI Portfolio Intel</span>
                  </div>
                </div>

                {/* User Profile Info on sidebar */}
                {user && (
                  <div className="p-4 rounded-2xl bg-[var(--bg-card)]/40 border border-white/5 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] font-black font-display bg-[var(--bg-card)] shadow-md overflow-hidden shrink-0">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <span className="text-xs font-bold text-[var(--accent)] font-mono">
                            {user.name ? user.name.slice(0, 2).toUpperCase() : "IP"}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-[var(--text-primary)] truncate">{user.name || "Investor"}</p>
                        <p className="text-[9px] text-[var(--text-secondary)] truncate font-medium">{user.email || "guest@finscope.ai"}</p>
                        <span className="text-[8px] font-mono font-black tracking-widest bg-[var(--accent)]/15 border border-[var(--accent)]/25 text-[var(--accent)] px-1.5 py-0.2 mt-1 inline-block rounded uppercase shadow-sm">
                          {user.membership || "Pro"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Nav Links */}
                <nav className="space-y-1">
                  {[
                    { id: "home", label: "Home Dashboard", icon: Home },
                    { id: "markets", label: "Markets Hub", icon: Compass },
                    { id: "news", label: "News & Briefings", icon: Newspaper },
                    { id: "ai", label: "AI Advisor", icon: Cpu },
                    { id: "profile", label: "Profile & Settings", icon: User }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition-all ${
                          isActive
                            ? "bg-[var(--bg-card)] text-[var(--accent)] border-l-2 border-[var(--accent)] shadow-md"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]/20"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"}`} />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Sidebar bottom indicator */}
              <div className="text-[9px] text-[var(--text-secondary)]/40 font-mono tracking-wider pt-4 border-t border-white/5">
                <p>FinScope AI v1.0.0</p>
                <p className="mt-1">© 2026 FinScope.ai</p>
              </div>
            </div>

            {/* Main content view */}
            <div className="flex-1 min-w-0 md:h-screen md:overflow-y-auto">
              {/* Navigated Subview wrapper */}
              <div className="max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto w-full relative">
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
          </div>
        )}
      

      {/* --- FLOATING OVERLAYS & SHEETS --- */}

      {/* 1. Global Search panel overlay */}
      
        {isSearchOpen && (
          <SearchOverlay
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectAsset={(sym, ty) => setSelectedAsset({ symbol: sym, type: ty })}
          />
        )}
      

      {/* 2. Asset Details Sliding bottom-sheet drawer */}
      
        {selectedAsset && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            {/* Backdrop click closer */}
            <div onClick={() => setSelectedAsset(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* The Sheet */}
            <div className="relative w-full max-w-xl mx-auto bg-[var(--bg-secondary)] border-t border-white/10 rounded-t-[32px] p-6 max-h-[90vh] overflow-y-auto z-10 shadow-2xl pb-16"
              id="details-sheet"
            >
              {/* Drag bar indicator */}
              <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-6 pointer-events-none" />

              {/* Top Row with closer & watchlist toggle */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[var(--bg-card)] rounded-2xl border border-white/5 font-bold font-mono text-[var(--accent)] text-xs">
                    {selectedAsset.symbol}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white tracking-tight">{companyProfile?.name || selectedAsset.symbol}</h2>
                    <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-mono mt-0.5">{selectedAsset.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleWatchFromDetails}
                    className={`p-3 rounded-2xl border transition-all ${
                      isWatch
                        ? "bg-[var(--accent)]/10 border-[var(--accent)]/20 text-[var(--accent)]"
                        : "bg-white/5 border-white/5 text-[var(--text-secondary)] hover:text-white"
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                  <button
                    onClick={() => setSelectedAsset(null)}
                    className="p-3 rounded-2xl bg-white/5 border border-white/5 text-[var(--text-secondary)] hover:text-white transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Asset Chart panel */}
              <div className="bg-[var(--bg-card)]/40 border border-white/5 rounded-3xl p-5 mb-6">
                {loadingAsset ? (
                  <div className="h-44 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
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
                    <span className="text-[9px] font-mono uppercase tracking-wide text-[var(--text-secondary)]">High</span>
                    <p className="text-xs font-bold font-mono text-white mt-1">${assetQuote.high.toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-[9px] font-mono uppercase tracking-wide text-[var(--text-secondary)]">Low</span>
                    <p className="text-xs font-bold font-mono text-white mt-1">${assetQuote.low.toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-[9px] font-mono uppercase tracking-wide text-[var(--text-secondary)]">Open</span>
                    <p className="text-xs font-bold font-mono text-white mt-1">${assetQuote.open.toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                    <span className="text-[9px] font-mono uppercase tracking-wide text-[var(--text-secondary)]">Close</span>
                    <p className="text-xs font-bold font-mono text-white mt-1">${assetQuote.prevClose.toFixed(2)}</p>
                  </div>
                </div>
              )}

              {/* Set custom alert panel */}
              <div className="bg-[var(--bg-card)]/20 border border-white/5 rounded-3xl p-5 mb-6">
                <h3 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-4 flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-[var(--accent)]" />
                  Add Target Threshold Alert
                </h3>
                
                {alertSuccess ? (
                  <div className="flex items-center gap-2 bg-[var(--chart-green)]/10 border border-[var(--chart-green)]/20 p-4 rounded-2xl text-xs text-white"
                  >
                    <CheckCircle className="w-5 h-5 text-[var(--chart-green)]" />
                    Target threshold alert compiled successfully!
                  </div>
                ) : (
                  <form onSubmit={handleCreatePriceAlert} className="flex gap-2 items-center">
                    {/* Condition toggle selector */}
                    <button
                      type="button"
                      onClick={() => setAlertCondition(alertCondition === "above" ? "below" : "above")}
                      className="px-3.5 py-3 rounded-xl bg-[var(--bg-card)] text-[10px] font-bold uppercase border border-white/5 text-[var(--accent)] tracking-wider"
                    >
                      {alertCondition === "above" ? "Goes Above" : "Goes Below"}
                    </button>
                    
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-secondary)]">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={alertPrice}
                        onChange={(e) => setAlertPrice(e.target.value)}
                        placeholder="Target Price"
                        className="w-full pl-7 pr-3 py-3 rounded-xl bg-[var(--bg-card)] border border-white/5 focus:border-[var(--accent)]/20 outline-none text-xs font-mono text-white"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="py-3 px-4 rounded-xl bg-[var(--btn-accent)] hover:bg-[var(--accent)] text-[var(--bg-primary)] text-xs font-bold transition-all"
                    >
                      SET ALERT
                    </button>
                  </form>
                )}
              </div>

              {/* Analyst Ratings panel */}
              {recommendations && (
                <div className="bg-[var(--bg-card)]/20 border border-white/5 rounded-3xl p-5 mb-6">
                  <h3 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-4 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
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
                    <div className="flex justify-between text-[10px] font-mono text-[var(--text-secondary)]">
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
                  <h3 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase border-b border-white/5 pb-2">
                    Company Profile
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <Landmark className="w-4 h-4 text-[var(--accent)]" />
                      <span>Industry: <strong className="text-white font-medium">{companyProfile.industry}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <Building className="w-4 h-4 text-[var(--accent)]" />
                      <span>CEO: <strong className="text-white font-medium">{companyProfile.ceo}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <MapPin className="w-4 h-4 text-[var(--accent)]" />
                      <span>Headquarters: <strong className="text-white font-medium">{companyProfile.headquarters}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                      <Globe className="w-4 h-4 text-[var(--accent)]" />
                      <a href={companyProfile.weburl} target="_blank" rel="noreferrer" className="text-white hover:text-[var(--accent)] flex items-center gap-1 font-medium hover:underline">
                        Visit Website
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-4">
                    {companyProfile.name} is a global leader in {companyProfile.industry.toLowerCase()} technologies. Headquartered in {companyProfile.headquarters}, it is monitored closely by equity research networks for high-volume allocation trends.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      

      {/* 3. News Details Sliding bottom-sheet drawer */}
      
        {selectedNews && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <div onClick={() => setSelectedNews(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <div className="relative w-full max-w-xl mx-auto bg-[var(--bg-secondary)] border-t border-white/10 rounded-t-[32px] p-6 max-h-[85vh] overflow-y-auto z-10 shadow-2xl pb-16"
              id="news-sheet"
            >
              <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-6" />

              {/* Close Button Header */}
              <div className="flex justify-between items-center mb-4">
                <span className="bg-[var(--accent)] text-[var(--bg-primary)] text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                  {selectedNews.category}
                </span>
                <button
                  onClick={() => setSelectedNews(null)}
                  className="p-3 rounded-2xl bg-white/5 border border-white/5 text-[var(--text-secondary)]"
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
              
              <div className="flex items-center gap-3 text-[10px] text-[var(--text-secondary)] font-mono mb-6 pb-4 border-b border-white/5">
                <span>{selectedNews.source}</span>
                <span>•</span>
                <span>{selectedNews.readTime || "3m read"}</span>
              </div>

              {/* Gemini AI Summary Segment */}
              <div className="bg-[var(--bg-card)] border border-[var(--accent)]/20 rounded-3xl p-5 mb-6 relative overflow-hidden">
                <h3 className="text-xs font-mono font-bold text-[var(--accent)] uppercase mb-3 flex items-center gap-1.5">
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
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {aiNewsSummary}
                  </p>
                )}
              </div>

              {/* Original Summary text details */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase">
                  Original Press Release Summary
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {selectedNews.summary || "Full details of this market announcement are being synchronized. Please monitor active regulatory filings."}
                </p>
              </div>
            </div>
          </div>
        )}
      
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
