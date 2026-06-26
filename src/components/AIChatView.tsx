/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { FinScopeAPI } from "../services/api";
import { Cpu, Send, Trash2, ArrowUpRight, Sparkles, MessageCircle, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

export const AIChatView: React.FC = () => {
  const { chatHistory, addChatMessage, clearChatHistory } = useApp();
  
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on message updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, sending]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || sending) return;
    
    // Add User message
    await addChatMessage("user", text);
    setMessage("");
    setSending(true);

    try {
      // Build previous context history for the model
      const historyContext = chatHistory.slice(-10).map((c) => ({
        sender: c.sender,
        message: c.message
      }));

      const reply = await FinScopeAPI.askAssistant(text, historyContext);
      
      // Add AI reply
      await addChatMessage("ai", reply);
    } catch (err) {
      console.error(err);
      await addChatMessage("ai", "I encountered a connection timeout. Please verify your internet connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(message);
  };

  // Recommended smart suggestions
  const suggestions = [
    "Compare Apple vs Microsoft",
    "Explain ETF expense ratios",
    "Should I diversify with Bitcoin?",
    "Technical Outlook on Nvidia NVDA"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] pt-6">
      {/* Header Panel */}
      <div className="flex items-center justify-between mb-5 px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#B6FF5A]/15 border border-[#B6FF5A]/20 flex items-center justify-center text-[#B6FF5A] shadow-[0_0_20px_rgba(182,255,90,0.15)]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display text-lg font-black text-white tracking-tight">FinScope AI Advisor</h1>
            <p className="text-[10px] text-emerald-400 font-mono tracking-wider uppercase font-bold">Gemini Intelligence Active</p>
          </div>
        </div>
        <button
          onClick={clearChatHistory}
          className="p-3 rounded-[14px] bg-[#163A2D] border border-white/10 text-[#A6B0AA] hover:text-[#FF5D5D] hover:border-[#FF5D5D]/40 transition-all shadow-md"
          title="Clear Chat Logs"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Advisory Warnings Indicator */}
      <div className="mx-4 mb-5 p-4 bg-gradient-to-br from-[#163A2D]/70 to-[#0D2B22]/70 border border-white/10 rounded-[20px] flex items-start gap-3 text-[10px] text-[#A6B0AA] leading-relaxed shadow-lg">
        <AlertCircle className="w-4 h-4 text-[#B6FF5A] shrink-0 mt-0.5" />
        <p className="font-medium">
          Generative summaries are educational briefs, not official brokerage recommendations. Review verified SEC filings before making allocation commits.
        </p>
      </div>

      {/* Chat messages viewport */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-6">
        {chatHistory.map((item) => {
          const isAI = item.sender === "ai";
          return (
            <div
              key={item.id}
              className={`flex ${isAI ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-[24px] text-xs leading-relaxed border shadow-md ${
                  isAI
                    ? "bg-gradient-to-br from-[#163A2D]/90 to-[#0D2B22]/90 text-white rounded-tl-none border-white/10"
                    : "bg-[#B6FF5A] text-[#071C16] rounded-tr-none border-[#B6FF5A]/20 font-bold"
                }`}
              >
                {isAI && (
                  <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-[#B6FF5A] uppercase mb-2 pb-2 border-b border-white/10">
                    <Sparkles className="w-3 h-3" />
                    AI Intelligence Analyst
                  </div>
                )}
                {/* Process markdown-style bullets elegantly */}
                <p className="whitespace-pre-line font-medium">
                  {item.message}
                </p>
                <span className={`block text-[8px] mt-2 font-mono text-right opacity-60 ${isAI ? "text-[#A6B0AA]" : "text-[#071C16]"}`}>
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {sending && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-br from-[#163A2D]/90 to-[#0D2B22]/90 border border-white/10 p-4 rounded-[24px] rounded-tl-none flex items-center gap-2 shadow-md">
              <span className="w-1.5 h-1.5 bg-[#B6FF5A] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-[#B6FF5A] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-[#B6FF5A] rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Recommended Prompt Suggestions row */}
      {chatHistory.length <= 1 && (
        <div className="px-4 mb-4">
          <p className="text-[10px] uppercase font-mono tracking-widest text-[#A6B0AA] mb-3 flex items-center gap-1.5 font-bold">
            <MessageCircle className="w-3.5 h-3.5 text-[#B6FF5A]" />
            RECOMMENDED QUERIES
          </p>
          <div className="flex flex-col gap-2.5">
            {suggestions.map((sug) => (
              <button
                key={sug}
                onClick={() => handleSendMessage(sug)}
                className="text-left py-3 px-4 rounded-[16px] bg-[#163A2D]/40 border border-white/10 text-[11px] text-[#A6B0AA] hover:text-white hover:border-[#B6FF5A]/40 transition-all flex items-center justify-between group shadow-sm"
              >
                <span className="font-bold">{sug}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#B6FF5A] opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer input form */}
      <form onSubmit={handleSubmit} className="p-4 bg-[#071C16]/95 backdrop-blur-md border-t border-white/10">
        <div className="relative flex items-center max-w-2xl mx-auto w-full">
          <input
            type="text"
            placeholder="Ask about sectors, tech profiles, or correlations..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={sending}
            className="w-full pl-5 pr-14 py-4 rounded-[20px] bg-[#163A2D]/80 border border-white/10 focus:border-[#B6FF5A]/50 focus:bg-[#163A2D] outline-none text-white text-xs transition-all shadow-md placeholder-[#A6B0AA]/60 font-medium"
          />
          <button
            type="submit"
            disabled={!message.trim() || sending}
            className="absolute right-2.5 p-2.5 rounded-[12px] bg-[#B6FF5A] text-[#071C16] hover:bg-[#b6ff5acc] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
