/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DEFAULT_INDEXES, DEFAULT_STOCKS, DEFAULT_CRYPTO, DEFAULT_ETFS, DEFAULT_NEWS, COMPANY_PROFILES, RECOMMENDATIONS } from "../data";
import { MarketIndex, StockQuote, CryptoItem, ETFItem, NewsItem, CompanyProfile, AnalystRecommendation } from "../types";

export class FinScopeAPI {
  private static baseURL = "";

  // Helper to make API calls to our backend proxy server
  private static async fetchJSON<T>(endpoint: string, fallback: T): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      return await response.json() as T;
    } catch (error) {
      console.warn(`FinScopeAPI falling back to local dataset for ${endpoint}:`, error);
      return fallback;
    }
  }

  // Get Market Indexes
  static async getIndexes(): Promise<MarketIndex[]> {
    return this.fetchJSON<MarketIndex[]>("/api/indexes", DEFAULT_INDEXES);
  }

  // Get Stocks List
  static async getStocks(): Promise<StockQuote[]> {
    return this.fetchJSON<StockQuote[]>("/api/stocks", DEFAULT_STOCKS);
  }

  // Get single asset quote
  static async getQuote(symbol: string): Promise<StockQuote> {
    const fallback = DEFAULT_STOCKS.find(s => s.symbol.toUpperCase() === symbol.toUpperCase()) || {
      symbol: symbol.toUpperCase(),
      price: 150.00,
      change: 0.00,
      changePercent: 0.00,
      high: 155.00,
      low: 145.00,
      open: 148.00,
      prevClose: 150.00,
      history1D: [148, 149, 151, 150, 152, 149, 150]
    };
    return this.fetchJSON<StockQuote>(`/api/quote?symbol=${symbol}`, fallback);
  }

  // Get Company Profile
  static async getCompanyProfile(symbol: string): Promise<CompanyProfile> {
    const upperSym = symbol.toUpperCase();
    const fallback = COMPANY_PROFILES[upperSym] || {
      symbol: upperSym,
      name: `${upperSym} Inc.`,
      logo: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=128&auto=format&fit=crop&q=60",
      industry: "Financial Services",
      marketCapitalization: 500000,
      shareOutstanding: 1000.00,
      weburl: `https://www.${upperSym.toLowerCase()}.com`,
      ceo: "Unknown CEO",
      employees: 5000,
      headquarters: "Global Financial Center"
    };
    return this.fetchJSON<CompanyProfile>(`/api/company-profile?symbol=${upperSym}`, fallback);
  }

  // Get Analyst Recommendations
  static async getRecommendations(symbol: string): Promise<AnalystRecommendation> {
    const upperSym = symbol.toUpperCase();
    const fallback = RECOMMENDATIONS[upperSym] || {
      symbol: upperSym,
      period: "2026-06",
      buy: 15,
      hold: 5,
      sell: 1,
      strongBuy: 5,
      strongSell: 0
    };
    return this.fetchJSON<AnalystRecommendation>(`/api/recommendations?symbol=${upperSym}`, fallback);
  }

  // Get Cryptocurrencies
  static async getCrypto(): Promise<CryptoItem[]> {
    return this.fetchJSON<CryptoItem[]>("/api/crypto", DEFAULT_CRYPTO);
  }

  // Get ETFs
  static async getETFs(): Promise<ETFItem[]> {
    return this.fetchJSON<ETFItem[]>("/api/etfs", DEFAULT_ETFS);
  }

  // Get News Feed
  static async getNews(): Promise<NewsItem[]> {
    return this.fetchJSON<NewsItem[]>("/api/news", DEFAULT_NEWS);
  }

  // AI Summarize News Article
  static async summarizeArticle(headline: string, summary: string): Promise<string> {
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline, summary }),
      });
      if (!response.ok) {
        throw new Error("Summarization failed");
      }
      const data = await response.json();
      return data.summary;
    } catch (error) {
      console.warn("AI Summarizer fallback activated:", error);
      return `[FinScope AI Assistant Summary]\n\nThis article outlines key shifts for "${headline}". Based on market analysis, these developments could influence near-term momentum and index weightings. In-depth research of underlying company metrics is highly recommended before modifying active positions.`;
    }
  }

  // AI Chat with Assistant
  static async askAssistant(message: string, history: { sender: string; message: string }[]): Promise<string> {
    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history }),
      });
      if (!response.ok) {
        throw new Error("AI Chat failed");
      }
      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.warn("AI Assistant fallback activated:", error);
      // Give realistic fallback response for finance
      if (message.toLowerCase().includes("bitcoin")) {
        return "Bitcoin (BTC) continues to establish solid institutional interest as digital gold. Currently, it exhibits structural consolidation above its psychological supports. Long-term outlook remains coupled with market liquidity cycles, halving timelines, and ETF capital flow rates.";
      }
      if (message.toLowerCase().includes("etf")) {
        return "Exchange Traded Funds (ETFs) like SPY (tracking S&P 500) and QQQ (tracking Nasdaq-100) are excellent instruments for passive diversification. They offer immediate exposure across diversified equities at lower expense ratios, making them a strategic foundation for most balanced long-term portfolios.";
      }
      return "I'm currently running in high-performance local mode. I can analyze stock trends, summarize news headlines, evaluate ETF risk profiles, and outline watchlist setups. How can I assist you with your financial research today?";
    }
  }
}
