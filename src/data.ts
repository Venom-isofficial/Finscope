/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MarketIndex, StockQuote, CryptoItem, ETFItem, NewsItem, CompanyProfile, AnalystRecommendation } from "./types";

export const DEFAULT_INDEXES: MarketIndex[] = [
  {
    name: "S&P 500",
    symbol: "^GSPC",
    price: 5241.53,
    change: 42.12,
    changePercent: 0.81,
    history: [5190, 5205, 5195, 5210, 5225, 5232, 5241.53]
  },
  {
    name: "NASDAQ 100",
    symbol: "^NDX",
    price: 18210.42,
    change: 215.18,
    changePercent: 1.20,
    history: [17980, 18010, 18080, 18120, 18090, 18150, 18210.42]
  },
  {
    name: "NIFTY 50",
    symbol: "^NSEI",
    price: 22403.85,
    change: -98.40,
    changePercent: -0.44,
    history: [22550, 22510, 22480, 22530, 22450, 22410, 22403.85]
  },
  {
    name: "Bitcoin",
    symbol: "BTC-USD",
    price: 67450.00,
    change: 1420.50,
    changePercent: 2.15,
    history: [65200, 66100, 65800, 66400, 67200, 66900, 67450.00]
  },
  {
    name: "Gold",
    symbol: "GC=F",
    price: 2315.80,
    change: 18.20,
    changePercent: 0.79,
    history: [2280, 2295, 2290, 2302, 2305, 2310, 2315.80]
  }
];

export const COMPANY_PROFILES: { [symbol: string]: CompanyProfile } = {
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc.",
    logo: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=128&auto=format&fit=crop&q=60",
    industry: "Technology",
    marketCapitalization: 3120000,
    shareOutstanding: 15441.88,
    weburl: "https://www.apple.com",
    ceo: "Tim Cook",
    employees: 164000,
    headquarters: "Cupertino, California"
  },
  MSFT: {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    logo: "https://images.unsplash.com/photo-1625014020770-ab972c70091e?w=128&auto=format&fit=crop&q=60",
    industry: "Software",
    marketCapitalization: 3240000,
    shareOutstanding: 7430.44,
    weburl: "https://www.microsoft.com",
    ceo: "Satya Nadella",
    employees: 221000,
    headquarters: "Redmond, Washington"
  },
  NVDA: {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    logo: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=128&auto=format&fit=crop&q=60",
    industry: "Semiconductors",
    marketCapitalization: 2850000,
    shareOutstanding: 2460.00,
    weburl: "https://www.nvidia.com",
    ceo: "Jensen Huang",
    employees: 29600,
    headquarters: "Santa Clara, California"
  },
  TSLA: {
    symbol: "TSLA",
    name: "Tesla Inc.",
    logo: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=128&auto=format&fit=crop&q=60",
    industry: "Automotive",
    marketCapitalization: 575000,
    shareOutstanding: 3180.00,
    weburl: "https://www.tesla.com",
    ceo: "Elon Musk",
    employees: 140000,
    headquarters: "Austin, Texas"
  },
  AMZN: {
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    logo: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=128&auto=format&fit=crop&q=60",
    industry: "Retail & Cloud",
    marketCapitalization: 1950000,
    shareOutstanding: 10380.00,
    weburl: "https://www.amazon.com",
    ceo: "Andy Jassy",
    employees: 1541000,
    headquarters: "Seattle, Washington"
  }
};

export const DEFAULT_STOCKS: StockQuote[] = [
  {
    symbol: "AAPL",
    price: 182.52,
    change: 3.48,
    changePercent: 1.94,
    high: 183.10,
    low: 179.25,
    open: 180.05,
    prevClose: 179.04,
    history1D: [179.2, 179.8, 180.4, 181.1, 180.9, 181.8, 182.52]
  },
  {
    symbol: "MSFT",
    price: 421.90,
    change: -2.10,
    changePercent: -0.50,
    high: 425.40,
    low: 419.80,
    open: 424.20,
    prevClose: 424.00,
    history1D: [424.0, 423.5, 421.1, 422.3, 420.5, 422.8, 421.90]
  },
  {
    symbol: "NVDA",
    price: 948.22,
    change: 28.50,
    changePercent: 3.10,
    high: 955.00,
    low: 920.10,
    open: 922.50,
    prevClose: 919.72,
    history1D: [920.5, 928.0, 934.1, 931.2, 939.9, 942.5, 948.22]
  },
  {
    symbol: "TSLA",
    price: 178.20,
    change: -5.40,
    changePercent: -2.94,
    high: 184.60,
    low: 176.10,
    open: 183.50,
    prevClose: 183.60,
    history1D: [183.5, 182.1, 180.4, 179.0, 181.2, 178.9, 178.20]
  },
  {
    symbol: "AMZN",
    price: 180.12,
    change: 1.88,
    changePercent: 1.05,
    high: 181.40,
    low: 177.80,
    open: 178.40,
    prevClose: 178.24,
    history1D: [178.1, 178.9, 179.4, 178.8, 179.2, 180.5, 180.12]
  }
];

export const DEFAULT_CRYPTO: CryptoItem[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: 67450.00,
    change: 1420.50,
    changePercent: 2.15,
    history: [65200, 66100, 65800, 66400, 67200, 66900, 67450.00]
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: 3485.20,
    change: 82.30,
    changePercent: 2.42,
    history: [3350, 3410, 3390, 3425, 3460, 3455, 3485.20]
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: 135.45,
    change: -4.12,
    changePercent: -2.95,
    history: [142.1, 140.5, 137.2, 139.8, 138.1, 136.5, 135.45]
  },
  {
    symbol: "XRP",
    name: "Ripple",
    price: 0.524,
    change: 0.012,
    changePercent: 2.34,
    history: [0.505, 0.512, 0.508, 0.515, 0.521, 0.518, 0.524]
  },
  {
    symbol: "DOGE",
    name: "Dogecoin",
    price: 0.128,
    change: 0.008,
    changePercent: 6.67,
    history: [0.118, 0.122, 0.120, 0.124, 0.126, 0.125, 0.128]
  }
];

export const DEFAULT_ETFS: ETFItem[] = [
  {
    symbol: "SPY",
    name: "SPDR S&P 500 ETF Trust",
    price: 522.20,
    change: 4.18,
    changePercent: 0.81,
    risk: "Medium",
    expenseRatio: 0.09,
    performance1Y: 24.5,
    history: [515, 518, 516, 519, 520, 521, 522.20],
    description: "SPY is one of the largest and most liquid ETFs in the world, tracking the index of 500 preeminent US large-cap equities."
  },
  {
    symbol: "QQQ",
    name: "Invesco QQQ Trust",
    price: 442.85,
    change: 5.25,
    changePercent: 1.20,
    risk: "High",
    expenseRatio: 0.20,
    performance1Y: 38.2,
    history: [432, 435, 439, 441, 438, 440, 442.85],
    description: "QQQ tracks the Nasdaq-100 Index, holding major tech giants and growth corporations including Apple, Microsoft, and Nvidia."
  },
  {
    symbol: "VOO",
    name: "Vanguard S&P 500 ETF",
    price: 479.50,
    change: 3.80,
    changePercent: 0.80,
    risk: "Medium",
    expenseRatio: 0.03,
    performance1Y: 24.6,
    history: [472, 475, 473, 476, 477, 478, 479.50],
    description: "VOO offers low-cost, direct exposure to the S&P 500 index with an industry-leading minimal expense ratio of just 0.03%."
  },
  {
    symbol: "ARKK",
    name: "ARK Innovation ETF",
    price: 43.15,
    change: -1.45,
    changePercent: -3.25,
    risk: "High",
    expenseRatio: 0.75,
    performance1Y: -8.4,
    history: [45.2, 44.8, 44.1, 45.0, 43.8, 44.2, 43.15],
    description: "ARKK is an actively managed fund targeting disruptive innovation sectors like genomics, autonomous vehicles, fintech, and AI."
  }
];

export const DEFAULT_NEWS: NewsItem[] = [
  {
    id: "news_1",
    category: "Economy",
    datetime: 1719360000,
    headline: "Fed Signals Possible Rate Cuts Later This Year as Inflation Softens",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=60",
    related: "Markets",
    source: "Financial Times",
    summary: "Federal Reserve officials noted that while economic expansion remains robust, inflationary indicators have progressively softened in the second quarter, fueling rising optimism for potential central bank benchmark interest rate cuts later in the year.",
    url: "https://example.com/fed-rate-cuts",
    readTime: "4 min read"
  },
  {
    id: "news_2",
    category: "Technology",
    datetime: 1719356400,
    headline: "Nvidia Unveils Next-Gen Blackwell Architecture to Fast-Track Massive AI Model Training",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop&q=60",
    related: "NVDA",
    source: "Reuters",
    summary: "Nvidia Corp CEO Jensen Huang introduced the Blackwell computing platform during an annual developer conference. The chips dramatically scale speed and computational efficiency, reducing energy consumption for training multi-trillion parameter artificial intelligence systems.",
    url: "https://example.com/nvidia-blackwell",
    readTime: "6 min read"
  },
  {
    id: "news_3",
    category: "Markets",
    datetime: 1719352800,
    headline: "Global Stock Markets Rally as Tech Sector Earnings Propel Indices Higher",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=60",
    related: "AAPL, MSFT",
    source: "Bloomberg",
    summary: "European and US equities gained solid ground in trading today, energized by blockbuster profits in the enterprise tech sector. The S&P 500 closed near record highs while global capital inflows showed consistent broadening across energy and industrial shares.",
    url: "https://example.com/global-rally",
    readTime: "5 min read"
  },
  {
    id: "news_4",
    category: "Crypto",
    datetime: 1719349200,
    headline: "Bitcoin Consolidation Pattern Breaks Upwards Towards All-Time High Resistance",
    image: "https://images.unsplash.com/photo-1516245834210-c4c142787335?w=600&auto=format&fit=crop&q=60",
    related: "BTC",
    source: "CoinDesk",
    summary: "Technical analysts report that Bitcoin is showing a strong bullish pennant breakout above $66,000. Rising institution inflows through spot Exchange Traded Funds have built a solid support base, setting a path towards retesting its historic peak of $73,700.",
    url: "https://example.com/btc-rally",
    readTime: "3 min read"
  }
];

export const IPO_CALENDAR = [
  { company: "Apex Systems", symbol: "APXS", date: "July 12, 2026", range: "$18.00 - $20.00", status: "Upcoming" },
  { company: "EcoCharge Batteries", symbol: "ECCH", date: "July 18, 2026", range: "$14.00 - $16.00", status: "Upcoming" },
  { company: "Fintech Horizon", symbol: "FTHZ", date: "August 02, 2026", range: "$22.00 - $25.00", status: "Upcoming" }
];

export const RECOMMENDATIONS: { [symbol: string]: AnalystRecommendation } = {
  AAPL: { symbol: "AAPL", period: "2026-06", buy: 24, hold: 8, sell: 1, strongBuy: 12, strongSell: 0 },
  MSFT: { symbol: "MSFT", period: "2026-06", buy: 30, hold: 4, sell: 0, strongBuy: 18, strongSell: 0 },
  NVDA: { symbol: "NVDA", period: "2026-06", buy: 35, hold: 6, sell: 1, strongBuy: 22, strongSell: 0 },
  TSLA: { symbol: "TSLA", period: "2026-06", buy: 12, hold: 15, sell: 5, strongBuy: 4, strongSell: 2 }
};

export const MARKET_MOVERS = {
  gainers: [
    { symbol: "NVDA", name: "NVIDIA Corp", price: 948.22, changePercent: 3.10 },
    { symbol: "AAPL", name: "Apple Inc.", price: 182.52, changePercent: 1.94 },
    { symbol: "AMZN", name: "Amazon.com Inc.", price: 180.12, changePercent: 1.05 }
  ],
  losers: [
    { symbol: "TSLA", name: "Tesla Inc.", price: 178.20, changePercent: -2.94 },
    { symbol: "MSFT", name: "Microsoft Corp", price: 421.90, changePercent: -0.50 }
  ],
  active: [
    { symbol: "NVDA", name: "NVIDIA Corp", volume: "42.5M", price: 948.22 },
    { symbol: "TSLA", name: "Tesla Inc.", volume: "88.1M", price: 178.20 },
    { symbol: "AAPL", name: "Apple Inc.", volume: "51.2M", price: 182.52 }
  ]
};

export const MARKET_HEATMAP = [
  { sector: "Technology", companies: [{ symbol: "AAPL", change: 1.94 }, { symbol: "MSFT", change: -0.50 }, { symbol: "NVDA", change: 3.10 }] },
  { sector: "Consumer Cyclical", companies: [{ symbol: "TSLA", change: -2.94 }, { symbol: "AMZN", change: 1.05 }] },
  { sector: "Crypto", companies: [{ symbol: "BTC", change: 2.15 }, { symbol: "ETH", change: 2.42 }] }
];
