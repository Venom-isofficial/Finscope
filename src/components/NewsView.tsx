/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { FinScopeAPI } from "../services/api";
import { NewsItem } from "../types";
import { Search, Bookmark, Sparkles, Share2, Eye, RefreshCw, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NewsViewProps {
  onShowNewsDetails: (article: NewsItem) => void;
}

export const NewsView: React.FC<NewsViewProps> = ({ onShowNewsDetails }) => {
  const { savedArticles, saveArticle, unsaveArticle } = useApp();
  
  const [activeTab, setActiveTab] = useState<"latest" | "bookmarks">("latest");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const loadNews = async () => {
    setLoading(true);
    try {
      const data = await FinScopeAPI.getNews();
      setNews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const categories = ["All", "Economy", "Technology", "Markets", "Mergers", "Regulation"];

  const filteredNews = news.filter((item) => {
    const matchesQuery = 
      item.headline.toLowerCase().includes(query.toLowerCase()) ||
      item.summary.toLowerCase().includes(query.toLowerCase());
    const matchesCat = selectedCategory === "All" || item.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesQuery && matchesCat;
  });

  const handleBookmarkToggle = (e: React.MouseEvent, article: NewsItem) => {
    e.stopPropagation();
    const isSaved = savedArticles.some(sa => sa.newsId === article.id);
    if (isSaved) {
      unsaveArticle(article.id);
    } else {
      saveArticle(article);
    }
  };

  return (
    <div className="flex flex-col pb-32 pt-6 px-4">
      {/* Title Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-[#A6B0AA] uppercase font-semibold block mb-0.5">FINANCIAL JOURNALISM</span>
          <h1 className="font-display text-2xl font-black text-white tracking-tight">FinScope Editorial</h1>
        </div>
        <button onClick={loadNews} className="p-3.5 rounded-[18px] bg-[#163A2D] border border-white/10 text-[#A6B0AA] hover:text-white hover:border-[#B6FF5A]/50 transition-all shadow-lg">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Toggles */}
      <div className="grid grid-cols-2 gap-2 bg-[#163A2D] rounded-[18px] p-1.5 border border-white/10 mb-8 shadow-md">
        <button
          onClick={() => setActiveTab("latest")}
          className={`py-3 rounded-[14px] text-xs font-black tracking-widest uppercase transition-all ${
            activeTab === "latest" ? "bg-[#B6FF5A] text-[#071C16] shadow-lg shadow-[#B6FF5A]/10" : "text-[#A6B0AA] hover:text-white"
          }`}
        >
          LATEST NEWS
        </button>
        <button
          onClick={() => setActiveTab("bookmarks")}
          className={`py-3 rounded-[14px] text-xs font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
            activeTab === "bookmarks" ? "bg-[#B6FF5A] text-[#071C16] shadow-lg shadow-[#B6FF5A]/10" : "text-[#A6B0AA] hover:text-white"
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          BOOKMARKS ({savedArticles.length})
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "latest" ? (
          <motion.div
            key="latest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Search within News */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A6B0AA]" />
              <input
                type="text"
                placeholder="Search headlines or summaries..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-[18px] bg-[#163A2D]/80 border border-white/10 focus:border-[#B6FF5A]/50 focus:bg-[#163A2D] outline-none text-white text-xs transition-all shadow-md placeholder-[#A6B0AA]/60"
              />
            </div>

            {/* Category Chips Horizontal Swiper */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-[#B6FF5A] text-[#071C16] shadow-md shadow-[#B6FF5A]/10"
                      : "bg-[#163A2D]/70 text-[#A6B0AA] border border-white/10 hover:text-white hover:border-[#B6FF5A]/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Highlighted Top Article */}
            {filteredNews.length > 0 && query === "" && selectedCategory === "All" && (
              <div
                onClick={() => onShowNewsDetails(filteredNews[0])}
                className="relative h-64 rounded-[24px] overflow-hidden border border-white/10 cursor-pointer shadow-2xl group"
              >
                <img src={filteredNews[0].image} alt="Featured" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071C16] via-[#071C16]/40 to-transparent" />
                
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="bg-[#B6FF5A] text-[#071C16] text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-[6px] mb-2.5 inline-block shadow-lg">
                    {filteredNews[0].category}
                  </span>
                  <h2 className="text-base font-black text-white line-clamp-2 leading-tight group-hover:text-[#B6FF5A] transition-colors">
                    {filteredNews[0].headline}
                  </h2>
                  <div className="flex justify-between items-center text-[10px] text-[#A6B0AA] mt-3.5 font-mono font-semibold">
                    <span>{filteredNews[0].source}</span>
                    <span className="flex items-center gap-1 text-[#B6FF5A] bg-[#B6FF5A]/10 px-2.5 py-1 rounded-[6px] border border-[#B6FF5A]/20">
                      <Eye className="w-3.5 h-3.5" />
                      View analysis
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Main scroll list */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="h-28 bg-white/5 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNews.slice(query === "" && selectedCategory === "All" ? 1 : 0).map((item) => {
                  const isSaved = savedArticles.some(sa => sa.newsId === item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => onShowNewsDetails(item)}
                      className="flex gap-4 p-4 rounded-[24px] bg-gradient-to-r from-[#163A2D]/80 to-[#0D2B22]/80 border border-white/10 hover:border-[#B6FF5A]/40 hover:shadow-2xl hover:translate-x-1 transition-all cursor-pointer shadow-lg"
                    >
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[9px] font-black font-mono text-[#B6FF5A] bg-[#B6FF5A]/10 px-2 py-0.5 rounded uppercase">{item.category}</span>
                            <span className="text-[9px] font-mono text-[#A6B0AA] font-semibold">{item.source}</span>
                          </div>
                          <h3 className="text-xs font-bold text-white leading-snug line-clamp-2 hover:text-[#B6FF5A] transition-colors">
                            {item.headline}
                          </h3>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/10">
                          <span className="text-[9px] text-[#A6B0AA] font-mono font-semibold">{item.readTime || "3m read"}</span>
                          <button
                            onClick={(e) => handleBookmarkToggle(e, item)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isSaved ? "text-[#B6FF5A] bg-[#B6FF5A]/15 border-[#B6FF5A]/30" : "text-[#A6B0AA] border-white/10 hover:bg-white/5"
                            }`}
                          >
                            <Bookmark className="w-3.5 h-3.5 fill-current" />
                          </button>
                        </div>
                      </div>

                      <img src={item.image} alt={item.headline} className="w-24 h-24 rounded-[16px] object-cover shrink-0" />
                    </div>
                  );
                })}

                {filteredNews.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-xs text-[#A6B0AA]">No news stories fit your specific filter parameters.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          /* BOOKMARKS VIEW */
          <motion.div
            key="bookmarks"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {savedArticles.length > 0 ? (
              savedArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => onShowNewsDetails({
                    id: article.newsId,
                    headline: article.title,
                    summary: article.summary,
                    source: article.source,
                    url: article.url,
                    image: article.image,
                    category: article.category,
                    datetime: article.datetime,
                    readTime: "3m read"
                  })}
                  className="flex gap-4 p-4 rounded-[24px] bg-gradient-to-r from-[#163A2D]/80 to-[#0D2B22]/80 border border-white/10 hover:border-[#B6FF5A]/40 hover:shadow-2xl hover:translate-x-1 transition-all cursor-pointer shadow-lg"
                >
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5 text-[9px] font-mono uppercase">
                        <span className="text-[#B6FF5A] font-black bg-[#B6FF5A]/10 px-2 py-0.5 rounded">{article.category}</span>
                        <span className="text-[#A6B0AA] font-semibold">{article.source}</span>
                      </div>
                      <h3 className="text-xs font-bold text-white leading-snug line-clamp-2 hover:text-[#B6FF5A] transition-colors">
                        {article.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/10">
                      <span className="text-[9px] text-[#A6B0AA] font-mono font-semibold">Saved {new Date(article.savedAt).toLocaleDateString()}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); unsaveArticle(article.newsId); }}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/15 hover:bg-red-500/20 transition-all"
                        title="Delete Bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <img src={article.image} alt={article.title} className="w-24 h-24 rounded-[16px] object-cover shrink-0" />
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-[#163A2D]/10 rounded-3xl border border-dashed border-white/5 p-6">
                <Bookmark className="w-8 h-8 text-[#A6B0AA] mx-auto mb-3" />
                <p className="text-sm text-[#A6B0AA]">No bookmarked news</p>
                <p className="text-xs text-[#A6B0AA]/60 mt-1 max-w-xs mx-auto">
                  Pin stories to review later even when offline or traveling.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
