var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_fs = __toESM(require("fs"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
var GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
var ai = new import_genai.GoogleGenAI({
  apiKey: GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
var FINNHUB_API_KEY = "d8u294pr01qinhufaab0d8u294pr01qinhufaabg";
app.use(import_express.default.json());
var MOCK_STOCKS = [
  { symbol: "AAPL", price: 182.52, change: 3.48, changePercent: 1.94, high: 183.1, low: 179.25, open: 180.05, prevClose: 179.04, history1D: [179.2, 179.8, 180.4, 181.1, 180.9, 181.8, 182.52] },
  { symbol: "MSFT", price: 421.9, change: -2.1, changePercent: -0.5, high: 425.4, low: 419.8, open: 424.2, prevClose: 424, history1D: [424, 423.5, 421.1, 422.3, 420.5, 422.8, 421.9] },
  { symbol: "NVDA", price: 948.22, change: 28.5, changePercent: 3.1, high: 955, low: 920.1, open: 922.5, prevClose: 919.72, history1D: [920.5, 928, 934.1, 931.2, 939.9, 942.5, 948.22] },
  { symbol: "TSLA", price: 178.2, change: -5.4, changePercent: -2.94, high: 184.6, low: 176.1, open: 183.5, prevClose: 183.6, history1D: [183.5, 182.1, 180.4, 179, 181.2, 178.9, 178.2] },
  { symbol: "AMZN", price: 180.12, change: 1.88, changePercent: 1.05, high: 181.4, low: 177.8, open: 178.4, prevClose: 178.24, history1D: [178.1, 178.9, 179.4, 178.8, 179.2, 180.5, 180.12] }
];
var MOCK_INDEXES = [
  { name: "S&P 500", symbol: "^GSPC", price: 5241.53, change: 42.12, changePercent: 0.81, history: [5190, 5205, 5195, 5210, 5225, 5232, 5241.53] },
  { name: "NASDAQ 100", symbol: "^NDX", price: 18210.42, change: 215.18, changePercent: 1.2, history: [17980, 18010, 18080, 18120, 18090, 18150, 18210.42] },
  { name: "NIFTY 50", symbol: "^NSEI", price: 22403.85, change: -98.4, changePercent: -0.44, history: [22550, 22510, 22480, 22530, 22450, 22410, 22403.85] },
  { name: "Bitcoin", symbol: "BTC-USD", price: 67450, change: 1420.5, changePercent: 2.15, history: [65200, 66100, 65800, 66400, 67200, 66900, 67450] },
  { name: "Gold", symbol: "GC=F", price: 2315.8, change: 18.2, changePercent: 0.79, history: [2280, 2295, 2290, 2302, 2305, 2310, 2315.8] }
];
var MOCK_CRYPTO = [
  { symbol: "BTC", name: "Bitcoin", price: 67450, change: 1420.5, changePercent: 2.15, history: [65200, 66100, 65800, 66400, 67200, 66900, 67450] },
  { symbol: "ETH", name: "Ethereum", price: 3485.2, change: 82.3, changePercent: 2.42, history: [3350, 3410, 3390, 3425, 3460, 3455, 3485.2] },
  { symbol: "SOL", name: "Solana", price: 135.45, change: -4.12, changePercent: -2.95, history: [142.1, 140.5, 137.2, 139.8, 138.1, 136.5, 135.45] },
  { symbol: "XRP", name: "Ripple", price: 0.524, change: 0.012, changePercent: 2.34, history: [0.505, 0.512, 0.508, 0.515, 0.521, 0.518, 0.524] },
  { symbol: "DOGE", name: "Dogecoin", price: 0.128, change: 8e-3, changePercent: 6.67, history: [0.118, 0.122, 0.12, 0.124, 0.126, 0.125, 0.128] }
];
var MOCK_ETFS = [
  { symbol: "SPY", name: "SPDR S&P 500 ETF Trust", price: 522.2, change: 4.18, changePercent: 0.81, risk: "Medium", expenseRatio: 0.09, performance1Y: 24.5, history: [515, 518, 516, 519, 520, 521, 522.2], description: "SPY tracks the index of 500 preeminent US large-cap equities." },
  { symbol: "QQQ", name: "Invesco QQQ Trust", price: 442.85, change: 5.25, changePercent: 1.2, risk: "High", expenseRatio: 0.2, performance1Y: 38.2, history: [432, 435, 439, 441, 438, 440, 442.85], description: "QQQ tracks the Nasdaq-100 Index, holding tech giants Apple, Microsoft, Nvidia, etc." },
  { symbol: "VOO", name: "Vanguard S&P 500 ETF", price: 479.5, change: 3.8, changePercent: 0.8, risk: "Medium", expenseRatio: 0.03, performance1Y: 24.6, history: [472, 475, 473, 476, 477, 478, 479.5], description: "VOO offers low-cost, direct exposure to the S&P 500 index." }
];
var MOCK_NEWS = [
  { id: "news_1", category: "Economy", datetime: Math.floor(Date.now() / 1e3), headline: "Fed Signals Possible Rate Cuts Later This Year as Inflation Softens", image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=60", related: "Markets", source: "Financial Times", summary: "Federal Reserve officials noted that inflation has progressively softened in the second quarter, fueling optimism for rate cuts later this year.", url: "https://example.com/fed-rate-cuts", readTime: "4 min read" },
  { id: "news_2", category: "Technology", datetime: Math.floor(Date.now() / 1e3) - 3600, headline: "Nvidia Unveils Next-Gen Blackwell Architecture to Fast-Track Massive AI Model Training", image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop&q=60", related: "NVDA", source: "Reuters", summary: "Nvidia CEO Jensen Huang introduced the Blackwell computing platform which scales training speed and energy efficiency of trillions of parameter models.", url: "https://example.com/nvidia-blackwell", readTime: "6 min read" },
  { id: "news_3", category: "Markets", datetime: Math.floor(Date.now() / 1e3) - 7200, headline: "Global Stock Markets Rally as Tech Sector Earnings Propel Indices Higher", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=60", related: "AAPL, MSFT", source: "Bloomberg", summary: "US and European equities rose sharply driven by solid enterprise software earnings. S&P 500 is hovering around multi-year highs.", url: "https://example.com/global-rally", readTime: "5 min read" }
];
app.get("/api/indexes", (req, res) => {
  res.json(MOCK_INDEXES);
});
app.get("/api/stocks", (req, res) => {
  res.json(MOCK_STOCKS);
});
app.get("/api/crypto", (req, res) => {
  res.json(MOCK_CRYPTO);
});
app.get("/api/etfs", (req, res) => {
  res.json(MOCK_ETFS);
});
app.get("/api/news", async (req, res) => {
  try {
    const finnhubUrl = `https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`;
    const response = await fetch(finnhubUrl);
    if (!response.ok) throw new Error("Finnhub failed");
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      const formatted = data.slice(0, 15).map((item, idx) => ({
        id: item.id?.toString() || `live_news_${idx}`,
        category: item.category || "Markets",
        datetime: item.datetime || Math.floor(Date.now() / 1e3),
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
app.get("/api/quote", async (req, res) => {
  const symbol = (req.query.symbol || "AAPL").toUpperCase();
  try {
    const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    if (!response.ok) throw new Error("Quote fetch failed");
    const data = await response.json();
    if (data && data.c > 0) {
      const mockHist = MOCK_STOCKS.find((s) => s.symbol === symbol)?.history1D || [
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
    const found = MOCK_STOCKS.find((s) => s.symbol === symbol);
    if (found) return res.json(found);
    throw new Error("Symbol not found");
  } catch (err) {
    res.json({
      symbol,
      price: 152.4,
      change: 1.2,
      changePercent: 0.79,
      high: 154,
      low: 151.2,
      open: 151.5,
      prevClose: 151.2,
      history1D: [151.2, 151.8, 152.4, 151.9, 153.1, 152, 152.4]
    });
  }
});
app.get("/api/company-profile", async (req, res) => {
  const symbol = (req.query.symbol || "AAPL").toUpperCase();
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
        marketCapitalization: data.marketCapitalization || 12e5,
        shareOutstanding: data.shareOutstanding || 5e3,
        weburl: data.weburl || "https://example.com",
        ceo: symbol === "AAPL" ? "Tim Cook" : symbol === "MSFT" ? "Satya Nadella" : symbol === "NVDA" ? "Jensen Huang" : symbol === "TSLA" ? "Elon Musk" : "Global Executive Officer",
        employees: data.employeeTotal || 15e3,
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
      marketCapitalization: 75e4,
      shareOutstanding: 4500,
      weburl: "https://example.com",
      ceo: "Unknown CEO",
      employees: 12e3,
      headquarters: "New York, USA"
    });
  }
});
app.get("/api/recommendations", (req, res) => {
  const symbol = (req.query.symbol || "AAPL").toUpperCase();
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
app.post("/api/summarize", async (req, res) => {
  const { headline, summary } = req.body;
  if (!GEMINI_API_KEY) {
    return res.json({
      summary: `[No API Key Present]

Based on "${headline}", markets are adjusting to recent information. Investors should monitor this news carefully as it might alter intermediate trendlines.`
    });
  }
  try {
    const prompt = `Please summarize this financial news in a short, elegant, professional paragraph for an executive briefing dashboard.
Headline: ${headline}
Article Summary: ${summary}
Please write in a sophisticated, concise style. Emphasize potential market impacts or implications. Keep it strictly below 4 sentences. Do not use markdown bullet lists.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt
    });
    res.json({ summary: response.text || "Summary could not be generated." });
  } catch (err) {
    console.error("Gemini summary error:", err);
    res.status(500).json({ error: "AI summarization failed" });
  }
});
app.post("/api/ai-chat", async (req, res) => {
  const { message, history } = req.body;
  if (!GEMINI_API_KEY) {
    return res.json({
      reply: "Hello! I am running in local sandbox fallback mode as the Gemini API key has not been configured. I can assist you with basic queries or layout tracking! Let me know if you would like to explore the FinScope features!"
    });
  }
  try {
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
      contents,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });
    res.json({ reply: response.text || "Apologies, I encountered a connection issue." });
  } catch (err) {
    console.error("Gemini Chat error:", err);
    res.status(500).json({ error: "Gemini Chat failed" });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "custom"
    });
    app.use(vite.middlewares);
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = import_fs.default.readFileSync(import_path.default.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FinScope Backend] Running full-stack environment on port ${PORT}`);
  });
}
startServer();
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=server.cjs.map
