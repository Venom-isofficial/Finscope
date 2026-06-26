/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  country: string;
  membership: "Free" | "Pro" | "Premium";
  createdAt: string;
}

export interface UserSettings {
  userId: string;
  theme: "dark-green" | "light" | "midnight";
  language: string;
  currency: string;
  country: string;
  pushNotifications: boolean;
  emailNotifications: boolean;
  updatedAt: string;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  symbol: string;
  name: string;
  type: "stock" | "crypto" | "etf";
  addedAt: string;
}

export interface SavedArticle {
  id: string;
  userId: string;
  newsId: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  image: string;
  category: string;
  datetime: number;
  savedAt: string;
}

export interface PriceAlert {
  id: string;
  userId: string;
  symbol: string;
  name: string;
  targetPrice: number;
  condition: "above" | "below";
  type: "price" | "news";
  isActive: boolean;
  createdAt: string;
}

export interface RecentSearch {
  id: string;
  userId: string;
  query: string;
  type: string;
  searchedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: "Today" | "Yesterday" | "Earlier";
  type: string;
  isRead: boolean;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  sender: "user" | "ai";
  message: string;
  timestamp: string;
}

export interface CompanyProfile {
  symbol: string;
  name: string;
  logo: string;
  industry: string;
  marketCapitalization: number;
  shareOutstanding: number;
  weburl: string;
  ceo?: string;
  employees?: number;
  headquarters?: string;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  history1D: number[];
}

export interface MarketIndex {
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  history: number[];
}

export interface NewsItem {
  id: string;
  category: string;
  datetime: number;
  headline: string;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
  readTime?: string;
}

export interface AnalystRecommendation {
  buy: number;
  hold: number;
  period: string;
  sell: number;
  strongBuy: number;
  strongSell: number;
  symbol: string;
}

export interface CryptoItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  history: number[];
}

export interface ETFItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  risk: "Low" | "Medium" | "High";
  expenseRatio: number;
  performance1Y: number;
  history: number[];
  description: string;
}
