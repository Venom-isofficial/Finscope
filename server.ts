/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini Client
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    }
  }
});

// Finnhub configuration
const FINNHUB_API_KEY = "d8u294pr01qinhufaab0d8u294pr01qinhufaabg";

app.use(express.json());

// Standard mock fallbacks
const MOCK_STOCKS = [
  { symbol: "AAPL", price: 182.52, change: 3.48, changePercent: 1.94, high: 183.10, low: 179.25, open: 180.05, prevClose: 179.04, history1D: [179.2, 179.8, 180.4, 181.1, 180.9, 181.8, 182.52] },
  { symbol: "MSFT", price: 421.90, change: -2.10, changePercent: -0.50, high: 425.40, low: 419.80, open: 424.20, prevClose: 424.00, history1D: [424.0, 423.5, 421.1, 422.3, 420.5, 422.8, 421.90] },
  { symbol: "NVDA", price: 948.22, change: 28.50, changePercent: 3.10, high: 955.00, low: 920.10, open: 922.50, prevClose: 919.72, history1D: [920.5, 928.0, 934.1, 931.2, 939.9, 942.5, 948.22] },
  { symbol: "TSLA", price: 178.20, change: -5.40, changePercent: -2.94, high: 184.60, low: 176.10, open: 183.50, prevClose: 183.60, history1D: [183.5, 182.1, 180.4, 179.0, 181.2, 178.9, 178.20] },
  { symbol: "AMZN", price: 180.12, change: 1.88, changePercent: 1.05, high: 181.40, low: 177.80, open: 178.40, prevClose: 178.24, history1D: [178.1, 178.9, 179.4, 178.8, 179.2, 180.5, 180.12] }
];

const MOCK_INDEXES = [
  { name: "S&P 500", symbol: "^GSPC", price: 5241.53, change: 42.12, changePercent: 0.81, history: [5190, 5205, 5195, 5210, 5225, 5232, 5241.53] },
  { name: "NASDAQ 100", symbol: "^NDX", price: 18210.42, change: 215.18, changePercent: 1.20, history: [17980, 18010, 18080, 18120, 18090, 18150, 18210.42] },
  { name: "NIFTY 50", symbol: "^NSEI", price: 22403.85, change: -98.40, changePercent: -0.44, history: [22550, 22510, 22480, 22530, 22450, 22410, 22403.85] },
  { name: "Bitcoin", symbol: "BTC-USD", price: 67450.00, change: 1420.50, changePercent: 2.15, history: [65200, 66100, 65800, 66400, 67200, 66900, 67450.00] },
  { name: "Gold", symbol: "GC=F", price: 2315.80, change: 18.20, changePercent: 0.79, history: [2280, 2295, 2290, 2302, 2305, 2310, 2315.80] }
];

const MOCK_CRYPTO = [
  { symbol: "BTC", name: "Bitcoin", price: 67450.00, change: 1420.50, changePercent: 2.15, history: [65200, 66100, 65800, 66400, 67200, 66900, 67450.00] },
  { symbol: "ETH", name: "Ethereum", price: 3485.20, change: 82.30, changePercent: 2.42, history: [3350, 3410, 3390, 3425, 3460, 3455, 3485.20] },
  { symbol: "SOL", name: "Solana", price: 135.45, change: -4.12, changePercent: -2.95, history: [142.1, 140.5, 137.2, 139.8, 138.1, 136.5, 135.45] },
  { symbol: "XRP", name: "Ripple", price: 0.524, change: 0.012, changePercent: 2.34, history: [0.505, 0.512, 0.508, 0.515, 0.521, 0.518, 0.524] },
  { symbol: "DOGE", name: "Dogecoin", price: 0.128, change: 0.008, changePercent: 6.67, history: [0.118, 0.122, 0.120, 0.124, 0.126, 0.125, 0.128] }
];

const MOCK_ETFS = [
  { symbol: "SPY", name: "SPDR S&P 500 ETF Trust", price: 522.20, change: 4.18, changePercent: 0.81, risk: "Medium", expenseRatio: 0.09, performance1Y: 24.5, history: [515, 518, 516, 519, 520, 521, 522.20], description: "SPY tracks the index of 500 preeminent US large-cap equities." },
  { symbol: "QQQ", name: "Invesco QQQ Trust", price: 442.85, change: 5.25, changePercent: 1.20, risk: "High", expenseRatio: 0.20, performance1Y: 38.2, history: [432, 435, 439, 441, 438, 440, 442.85], description: "QQQ tracks the Nasdaq-100 Index, holding tech giants Apple, Microsoft, Nvidia, etc." },
  { symbol: "VOO", name: "Vanguard S&P 500 ETF", price: 479.50, change: 3.80, changePercent: 0.80, risk: "Medium", expenseRatio: 0.03, performance1Y: 24.6, history: [472, 475, 473, 476, 477, 478, 479.50], description: "VOO offers low-cost, direct exposure to the S&P 500 index." }
];

const MOCK_NEWS = [
  { id: "news_1", category: "Economy", datetime: Math.floor(Date.now() / 1000), headline: "Fed Signals Possible Rate Cuts Later This Year as Inflation Softens", image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=60", related: "Markets", source: "Financial Times", summary: "Federal Reserve officials noted that inflation has progressively softened in the second quarter, fueling optimism for rate cuts later this year.", url: "https://example.com/fed-rate-cuts", readTime: "4 min read" },
  { id: "news_2", category: "Technology", datetime: Math.floor(Date.now() / 1000) - 3600, headline: "Nvidia Unveils Next-Gen Blackwell Architecture to Fast-Track Massive AI Model Training", image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop&q=60", related: "NVDA", source: "Reuters", summary: "Nvidia CEO Jensen Huang introduced the Blackwell computing platform which scales training speed and energy efficiency of trillions of parameter models.", url: "https://example.com/nvidia-blackwell", readTime: "6 min read" },
  { id: "news_3", category: "Markets", datetime: Math.floor(Date.now() / 1000) - 7200, headline: "Global Stock Markets Rally as Tech Sector Earnings Propel Indices Higher", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=60", related: "AAPL, MSFT", source: "Bloomberg", summary: "US and European equities rose sharply driven by solid enterprise software earnings. S&P 500 is hovering around multi-year highs.", url: "https://example.com/global-rally", readTime: "5 min read" }
];

// --- FINANCIAL API PROXY ROUTES ---

// 1. Get Indexes
app.get("/api/indexes", (req, res) => {
  res.json(MOCK_INDEXES);
});

// 2. Get Stocks List
app.get("/api/stocks", (req, res) => {
  res.json(MOCK_STOCKS);
});

// 3. Get Cryptocurrencies
app.get("/api/crypto", (req, res) => {
  res.json(MOCK_CRYPTO);
});

// 4. Get ETFs
app.get("/api/etfs", (req, res) => {
  res.json(MOCK_ETFS);
});

// 5. Get General News
app.get("/api/news", async (req, res) => {
  try {
    const finnhubUrl = `https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`;
    const response = await fetch(finnhubUrl);
    if (!response.ok) throw new Error("Finnhub failed");
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      // Format news correctly
      const formatted = data.slice(0, 15).map((item: any, idx: number) => ({
        id: item.id?.toString() || `live_news_${idx}`,
        category: item.category || "Markets",
        datetime: item.datetime || Math.floor(Date.now() / 1000),
        headline: item.headline || "Market Update",
        image: item.image || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=60",
        related: item.related || "",
        source: item.source || "NewsRoom",
        summary: item.summary || "",
        url: item.url || "#",
        readTime: "3 min read"
      }));
      return res.json(formatted);
    }
    res.json(MOCK_NEWS);
  } catch (error) {
    console.warn("Finnhub news fallback triggered:", error);
    res.json(MOCK_NEWS);
  }
});

// 6. Get quote details (using live Finnhub API or local fallback)
app.get("/api/quote", async (req, res) => {
  const symbol = (req.query.symbol as string || "AAPL").toUpperCase();
  try {
    const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    if (!response.ok) throw new Error("Quote fetch failed");
    const data = await response.json();
    
    // Check if it's a valid quote
    if (data && data.c > 0) {
      const mockHist = MOCK_STOCKS.find(s => s.symbol === symbol)?.history1D || [
        data.pc * 0.99,
        data.pc * 0.995,
        data.o,
        (data.o + data.c) / 2,
        data.l,
        data.h,
        data.c
      ];
      return res.json({
        symbol,
        price: data.c,
        change: data.d,
        changePercent: data.dp,
        high: data.h,
        low: data.l,
        open: data.o,
        prevClose: data.pc,
        history1D: mockHist
      });
    }
    
    // Check if in mock list
    const found = MOCK_STOCKS.find(s => s.symbol === symbol);
    if (found) return res.json(found);
    
    throw new Error("Symbol not found");
  } catch (err) {
    // Return standard dummy fallback
    res.json({
      symbol,
      price: 152.40,
      change: 1.20,
      changePercent: 0.79,
      high: 154.00,
      low: 151.20,
      open: 151.50,
      prevClose: 151.20,
      history1D: [151.2, 151.8, 152.4, 151.9, 153.1, 152.0, 152.4]
    });
  }
});

// 7. Get Company Profile details
app.get("/api/company-profile", async (req, res) => {
  const symbol = (req.query.symbol as string || "AAPL").toUpperCase();
  try {
    const response = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    if (!response.ok) throw new Error("Profile failed");
    const data = await response.json();
    if (data && data.name) {
      return res.json({
        symbol: data.ticker || symbol,
        name: data.name,
        logo: data.logo || "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=128&auto=format&fit=crop&q=60",
        industry: data.finnhubIndustry || "Technology",
        marketCapitalization: data.marketCapitalization || 1200000,
        shareOutstanding: data.shareOutstanding || 5000,
        weburl: data.weburl || "https://example.com",
        ceo: symbol === "AAPL" ? "Tim Cook" : symbol === "MSFT" ? "Satya Nadella" : symbol === "NVDA" ? "Jensen Huang" : symbol === "TSLA" ? "Elon Musk" : "Global Executive Officer",
        employees: data.employeeTotal || 15000,
        headquarters: symbol === "AAPL" ? "Cupertino, California" : symbol === "MSFT" ? "Redmond, Washington" : symbol === "NVDA" ? "Santa Clara, California" : "Global Financial Hub"
      });
    }
    throw new Error("No profile");
  } catch (err) {
    res.json({
      symbol,
      name: `${symbol} Inc.`,
      logo: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=128&auto=format&fit=crop&q=60",
      industry: "Financial Assets",
      marketCapitalization: 750000,
      shareOutstanding: 4500,
      weburl: "https://example.com",
      ceo: "Unknown CEO",
      employees: 12000,
      headquarters: "New York, USA"
    });
  }
});

// 8. Analyst Recommendations
app.get("/api/recommendations", (req, res) => {
  const symbol = (req.query.symbol as string || "AAPL").toUpperCase();
  res.json({
    symbol,
    period: "2026-06",
    buy: symbol === "AAPL" ? 22 : symbol === "MSFT" ? 28 : symbol === "NVDA" ? 34 : 10,
    hold: symbol === "AAPL" ? 8 : symbol === "MSFT" ? 5 : symbol === "NVDA" ? 4 : 12,
    sell: symbol === "AAPL" ? 1 : symbol === "MSFT" ? 0 : symbol === "NVDA" ? 1 : 4,
    strongBuy: symbol === "AAPL" ? 14 : symbol === "MSFT" ? 19 : symbol === "NVDA" ? 25 : 2,
    strongSell: 0
  });
});


// --- GEMINI AI SERVICES ---

// AI news summarizer
app.post("/api/summarize", async (req, res) => {
  const { headline, summary } = req.body;
  
  if (!GEMINI_API_KEY) {
    return res.json({
      summary: `[No API Key Present]\n\nBased on "${headline}", markets are adjusting to recent information. Investors should monitor this news carefully as it might alter intermediate trendlines.`
    });
  }

  try {
    const prompt = `Please summarize this financial news in a short, elegant, professional paragraph for an executive briefing dashboard.
Headline: ${headline}
Article Summary: ${summary}
Please write in a sophisticated, concise style. Emphasize potential market impacts or implications. Keep it strictly below 4 sentences. Do not use markdown bullet lists.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ summary: response.text || "Summary could not be generated." });
  } catch (err) {
    console.error("Gemini summary error:", err);
    res.status(500).json({ error: "AI summarization failed" });
  }
});

// AI Chatbot advisor
app.post("/api/ai-chat", async (req, res) => {
  const { message, history } = req.body;

  if (!GEMINI_API_KEY) {
    return res.json({
      reply: "Hello! I am running in local sandbox fallback mode as the Gemini API key has not been configured. I can assist you with basic queries or layout tracking! Let me know if you would like to explore the FinScope features!"
    });
  }

  try {
    // Format conversation history correctly for Gemini
    const systemInstruction = `You are the FinScope Intelligent AI Advisor.
You are a top-tier financial analyst, portfolio manager, and macro economist.
Provide objective, highly detailed, professional, and clear answers to user financial questions.
You do NOT offer official personalized investment advice or trade recommendations, but rather structure educational insights, trend breakdowns, comparisons (e.g. Apple vs Microsoft), and help them understand market mechanisms.
Maintain an executive, calm, wise tone. Use precise terms like "yield curve", "valuation metrics", "compound interest", "drawdowns", and "asset correlation". Keep your responses clean, well-spaced, and easy to read.`;

    const contents = [];
    if (history && history.length > 0) {
      for (const turn of history) {
        contents.push({
          role: turn.sender === "user" ? "user" : "model",
          parts: [{ text: turn.message }]
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents as any,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text || "Apologies, I encountered a connection issue." });
  } catch (err) {
    console.error("Gemini Chat error:", err);
    res.status(500).json({ error: "Gemini Chat failed" });
  }
});


// --- VITE MIDDLEWARE SETUP ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FinScope Backend] Running full-stack environment on port ${PORT}`);
  });
}

startServer();
