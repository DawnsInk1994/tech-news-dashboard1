"use client";

import { useState, useEffect } from "react";
import { ExternalLink, Bookmark, BookmarkCheck, Sparkles } from "lucide-react";
import type { NewsItem } from "@/lib/types";
import { CATEGORY_MAP } from "@/lib/categories";
import { timeAgo } from "@/lib/rss";
import { getReadArticles, markAsRead, getSavedLinks, toggleSaveArticle } from "@/lib/readArticles";
import { matchesKeyword } from "@/lib/keywords";
import ArticleSummary from "./ArticleSummary";

const CAT_GRADIENTS: Record<string, string> = {
  ai:            "linear-gradient(90deg,#7c3aed,#a855f7,#38bdf8)",
  social:        "linear-gradient(90deg,#1d4ed8,#3b82f6,#38bdf8)",
  security:      "linear-gradient(90deg,#b91c1c,#ef4444,#f97316)",
  space:         "linear-gradient(90deg,#0f766e,#14b8a6,#38bdf8)",
  siliconvalley: "linear-gradient(90deg,#b45309,#f59e0b,#fde68a)",
  radar:         "linear-gradient(90deg,#be185d,#ec4899,#f43f5e)",
};

interface Props {
  item: NewsItem;
  keywords: string[];
}

export default function NewsCard({ item, keywords }: Props) {
  const [isRead, setIsRead]       = useState(false);
  const [isSaved, setIsSaved]     = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    setIsRead(getReadArticles().has(item.link));
    setIsSaved(getSavedLinks().has(item.link));
  }, [item.link]);

  function handleRead() { markAsRead(item.link); setIsRead(true); }

  function handleSave(e: React.MouseEvent) {
    e.preventDefault();
    setIsSaved(toggleSaveArticle(item.link));
  }

  const cat = CATEGORY_MAP[item.category];
  const gradient = CAT_GRADIENTS[item.category] ?? "linear-gradient(90deg,#6366f1,#8b5cf6)";
  const isTrending = (item.trendScore ?? 1) >= 3;
  const matchedKw = matchesKeyword((item.titleHe ?? item.title) + " " + item.summary, keywords);

  return (
    <>
      <article
        className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
        style={{
          background: "var(--bg-card, #0e0f1c)",
          border: matchedKw
            ? "1px solid rgba(139,92,246,0.5)"
            : isRead
              ? "1px solid rgba(255,255,255,0.04)"
              : "1px solid rgba(255,255,255,0.08)",
          boxShadow: matchedKw
            ? "0 0 0 2px rgba(139,92,246,0.15), 0 4px 24px rgba(0,0,0,0.4)"
            : "0 4px 24px rgba(0,0,0,0.4)",
          opacity: isRead && !matchedKw ? 0.55 : 1,
        }}
      >
        {/* Coloured top bar */}
        <div className="h-1" style={{ background: isRead && !matchedKw ? "rgba(255,255,255,0.1)" : gradient }} />

        {/* Body */}
        <div className="p-5 flex flex-col gap-3 flex-1">

          {/* Meta row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest"
              style={{ background: isRead && !matchedKw ? "rgba(255,255,255,0.08)" : gradient, color: isRead && !matchedKw ? "#555575" : "#fff" }}>
              {cat?.labelHe ?? item.category}
            </span>
            {isTrending && (
              <span className="text-[11px] font-black px-2 py-0.5 rounded-full"
                style={{ background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.35)", color: "#fb923c" }}>
                🔥 טרנד
              </span>
            )}
            {matchedKw && (
              <span className="text-[11px] font-black px-2 py-0.5 rounded-full"
                style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.4)", color: "#c4b5fd" }}>
                ★ {matchedKw}
              </span>
            )}
            <span className="text-xs font-semibold" style={{ color: isRead && !matchedKw ? "#404060" : (cat?.color ?? "#9090b0") }}>
              {item.source}
            </span>
            <span className="flex-1" />
            <span className="text-xs" style={{ color: "#3a3a60" }}>{timeAgo(item.pubDate)}</span>
          </div>

          {/* Headline */}
          <a href={item.link} target="_blank" rel="noopener noreferrer" className="group" onClick={handleRead}>
            <h2 className="text-base font-bold leading-snug group-hover:opacity-80 transition-opacity"
              style={{ color: isRead && !matchedKw ? "#444464" : "var(--txt-primary, #ddddf0)" }} dir="rtl">
              {item.titleHe ?? item.title}
            </h2>
            {item.titleHe && (
              <p className="text-[11px] mt-1 leading-snug" style={{ color: "#303055" }} dir="ltr">{item.title}</p>
            )}
          </a>

          {/* Summary */}
          {item.summary && (
            <p className="text-sm leading-relaxed line-clamp-3"
              style={{ color: isRead && !matchedKw ? "#383858" : "var(--txt-secondary, #6a6a98)" }}>
              {item.summary}
            </p>
          )}
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />

        {/* Actions */}
        <div className="px-5 py-3.5 flex gap-2">
          {/* AI Summary button */}
          <button
            onClick={() => setShowSummary(true)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold flex-shrink-0 transition-all hover:opacity-80"
            style={{
              background: "rgba(139,92,246,0.12)",
              border: "1px solid rgba(139,92,246,0.25)",
              color: "#a78bfa",
            }}
          >
            <Sparkles size={12} />
            סכם
          </button>

          {/* Read source button */}
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleRead}
            className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl text-xs font-bold transition-all hover:opacity-90"
            style={{
              background: isRead && !matchedKw ? "rgba(255,255,255,0.06)" : gradient,
              color: isRead && !matchedKw ? "#404060" : "#fff",
              boxShadow: isRead && !matchedKw ? "none" : "0 2px 12px rgba(139,92,246,0.3)",
            }}
          >
            <ExternalLink size={13} />
            {isRead && !matchedKw ? "נקרא" : "קרא"}
          </a>

          {/* Bookmark button */}
          <button
            onClick={handleSave}
            className="flex items-center justify-center p-2.5 rounded-xl flex-shrink-0 transition-all hover:opacity-80"
            style={{
              background: isSaved ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.05)",
              border: isSaved ? "1px solid rgba(139,92,246,0.4)" : "1px solid rgba(255,255,255,0.08)",
              color: isSaved ? "#c4b5fd" : "#505070",
            }}
          >
            {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
          </button>
        </div>
      </article>

      {/* AI Summary drawer */}
      {showSummary && <ArticleSummary item={item} onClose={() => setShowSummary(false)} />}
    </>
  );
}
