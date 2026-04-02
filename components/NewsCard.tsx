"use client";

import { useState } from "react";
import { ExternalLink, Pen, Loader2, Copy, Check, Save } from "lucide-react";
import type { NewsItem, WrittenArticle, SavedArticle } from "@/lib/types";
import { CATEGORY_MAP } from "@/lib/categories";
import { timeAgo } from "@/lib/rss";
import { generateArticleId } from "@/lib/storage";

// Per-category gradient top bar
const CAT_GRADIENTS: Record<string, string> = {
  ai:            "linear-gradient(90deg,#7c3aed,#a855f7,#38bdf8)",
  social:        "linear-gradient(90deg,#1d4ed8,#3b82f6,#38bdf8)",
  security:      "linear-gradient(90deg,#b91c1c,#ef4444,#f97316)",
  space:         "linear-gradient(90deg,#0f766e,#14b8a6,#38bdf8)",
  siliconvalley: "linear-gradient(90deg,#b45309,#f59e0b,#fde68a)",
  radar:         "linear-gradient(90deg,#be185d,#ec4899,#f43f5e)",
};

interface NewsCardProps {
  item: NewsItem;
  onSave: (a: SavedArticle) => void;
}

export default function NewsCard({ item, onSave }: NewsCardProps) {
  const [writing, setWriting] = useState(false);
  const [article, setArticle] = useState<WrittenArticle | null>(null);
  const [error, setError]     = useState<string | null>(null);
  const [copied, setCopied]   = useState(false);
  const [saved,  setSaved]    = useState(false);

  const cat = CATEGORY_MAP[item.category];
  const gradient = CAT_GRADIENTS[item.category] ?? "linear-gradient(90deg,#6366f1,#8b5cf6)";

  async function handleWrite() {
    setWriting(true); setError(null); setArticle(null);
    try {
      const res = await fetch("/api/write-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: item.title, summary: item.summary, link: item.link, source: item.source }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || `שגיאה ${res.status}`);
      setArticle(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "שגיאה לא ידועה");
    } finally {
      setWriting(false);
    }
  }

  function buildText() {
    if (!article) return "";
    return [article.headline, article.subhead, "", ...article.bullets.map(b => `• ${b}`), "", article.body].join("\n");
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(buildText());
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  function handleSave() {
    if (!article) return;
    onSave({ id: generateArticleId(), ...article, sourceTitle: item.title, sourceLink: item.link, category: item.category, savedAt: new Date().toISOString() });
    setSaved(true); setTimeout(() => setSaved(false), 2500);
  }

  return (
    <article className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
      style={{
        background: "#0e0f1c",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}>

      {/* Coloured top bar */}
      <div className="h-1" style={{ background: gradient }} />

      {/* Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">

        {/* Meta row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest"
            style={{ background: gradient, color: "#fff", letterSpacing: "0.08em" }}>
            {cat?.labelHe ?? item.category}
          </span>
          <span className="text-xs font-semibold" style={{ color: cat?.color ?? "#9090b0" }}>
            {item.source}
          </span>
          <span className="flex-1" />
          <span className="text-xs" style={{ color: "#3a3a60" }}>{timeAgo(item.pubDate)}</span>
        </div>

        {/* Headline */}
        <a href={item.link} target="_blank" rel="noopener noreferrer" className="group">
          <h2 className="text-base font-bold leading-snug group-hover:opacity-80 transition-opacity"
            style={{ color: "#ddddf0" }}>
            {item.title}
          </h2>
        </a>

        {/* Summary */}
        {item.summary && (
          <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "#5a5a88" }}>
            {item.summary}
          </p>
        )}
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />

      {/* Action row */}
      <div className="px-5 py-3.5 flex items-center gap-2">
        <button onClick={handleWrite} disabled={writing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all"
          style={{
            background: writing ? "rgba(139,92,246,0.15)" : gradient,
            color: writing ? "#7c5cbf" : "#fff",
            cursor: writing ? "not-allowed" : "pointer",
            boxShadow: writing ? "none" : "0 2px 12px rgba(139,92,246,0.4)",
          }}>
          {writing ? <Loader2 size={13} className="animate-spin" /> : <Pen size={13} />}
          {writing ? "כותב…" : "כתוב ידיעה"}
        </button>

        <a href={item.link} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#7070a0",
          }}>
          <ExternalLink size={12} />
          קרא מקור
        </a>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-5 mb-4 px-3.5 py-2.5 rounded-xl text-xs font-medium"
          style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}>
          {error}
        </div>
      )}

      {/* Written article */}
      {article && (
        <div className="mx-5 mb-5 rounded-2xl overflow-hidden animate-slide-up"
          style={{ background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.25)" }}>

          {/* Article header */}
          <div className="px-4 py-2.5 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(139,92,246,0.15)", background: "rgba(139,92,246,0.1)" }}>
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#8b5cf6" }}>
              ✦ ידיעה מוכנה
            </span>
            <div className="flex gap-1.5">
              <button onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all"
                style={{
                  background: copied ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.07)",
                  border: `1px solid ${copied ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.12)"}`,
                  color: copied ? "#86efac" : "#9090b0",
                }}>
                {copied ? <Check size={11} /> : <Copy size={11} />}
                {copied ? "הועתק!" : "העתק"}
              </button>
              <button onClick={handleSave}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all"
                style={{
                  background: saved ? "rgba(139,92,246,0.35)" : "rgba(139,92,246,0.18)",
                  border: `1px solid ${saved ? "rgba(139,92,246,0.6)" : "rgba(139,92,246,0.3)"}`,
                  color: saved ? "#c4b5fd" : "#a78bfa",
                }}>
                {saved ? <Check size={11} /> : <Save size={11} />}
                {saved ? "נשמר!" : "שמור"}
              </button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {/* Headline */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "#4a3a80" }}>כותרת</p>
              <p className="text-sm font-bold leading-snug" style={{ color: "#e0e0f8" }}>{article.headline}</p>
            </div>
            {/* Subhead */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "#4a3a80" }}>כותרת משנה</p>
              <p className="text-xs leading-relaxed" style={{ color: "#a0a0cc" }}>{article.subhead}</p>
            </div>
            {/* Bullets */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: "#4a3a80" }}>עיקרי הידיעה</p>
              <ul className="space-y-1.5">
                {article.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "#c0c0e0" }}>
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: gradient.includes("gradient") ? undefined : "#8b5cf6",
                               backgroundImage: gradient }} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            {/* Body */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: "#4a3a80" }}>גוף הידיעה</p>
              <div className="text-xs leading-relaxed space-y-2" style={{ color: "#7878aa" }}>
                {article.body.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
