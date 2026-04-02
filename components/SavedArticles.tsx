"use client";

import { useState } from "react";
import { Trash2, Copy, Check, BookMarked, ChevronDown, ChevronUp, ClipboardList } from "lucide-react";
import type { SavedArticle } from "@/lib/types";
import { CATEGORY_MAP } from "@/lib/categories";

const CAT_GRADIENTS: Record<string, string> = {
  ai:            "linear-gradient(90deg,#7c3aed,#a855f7)",
  social:        "linear-gradient(90deg,#1d4ed8,#3b82f6)",
  security:      "linear-gradient(90deg,#b91c1c,#ef4444)",
  space:         "linear-gradient(90deg,#0f766e,#14b8a6)",
  siliconvalley: "linear-gradient(90deg,#b45309,#f59e0b)",
  radar:         "linear-gradient(90deg,#be185d,#ec4899)",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("he-IL", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" });
}

function ArticleRow({ article, onDelete }: { article: SavedArticle; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [copied,   setCopied]   = useState(false);
  const cat      = CATEGORY_MAP[article.category];
  const gradient = CAT_GRADIENTS[article.category] ?? "linear-gradient(90deg,#6366f1,#8b5cf6)";

  async function handleCopy() {
    await navigator.clipboard.writeText(
      [article.headline, article.subhead, "", ...article.bullets.map(b=>`• ${b}`), "", article.body].join("\n")
    );
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl overflow-hidden transition-all"
      style={{ background: "#0e0f1c", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="h-0.5" style={{ background: gradient }} />

      {/* Header */}
      <div className="px-4 py-3 flex items-start gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={() => setExpanded(e => !e)}>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold leading-snug truncate" style={{ color: "#e0e0f8" }}>
            {article.headline}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: gradient, color: "#fff" }}>
              {cat?.labelHe ?? article.category}
            </span>
            <span className="text-[10px]" style={{ color: "#3a3a60" }}>{formatDate(article.savedAt)}</span>
          </div>
        </div>
        {expanded ? <ChevronUp size={14} style={{ color: "#505070" }} /> : <ChevronDown size={14} style={{ color: "#505070" }} />}
      </div>

      {/* Expanded */}
      {expanded && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="px-4 py-3 space-y-2.5">
            <p className="text-xs leading-relaxed" style={{ color: "#a0a0cc" }}>{article.subhead}</p>
            <ul className="space-y-1">
              {article.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-xs" style={{ color: "#c0c0e0" }}>
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: cat?.color ?? "#8b5cf6" }} />
                  {b}
                </li>
              ))}
            </ul>
            <div className="text-xs leading-relaxed space-y-1.5" style={{ color: "#6060a0" }}>
              {article.body.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <a href={article.sourceLink} target="_blank" rel="noopener noreferrer"
              className="text-[10px] truncate block hover:opacity-60 transition-opacity"
              style={{ color: "#3a3a60" }} onClick={e => e.stopPropagation()}>
              מקור: {article.sourceTitle}
            </a>
          </div>
          <div className="px-4 py-2.5 flex gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <button onClick={e => { e.stopPropagation(); handleCopy(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background: copied ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${copied ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.08)"}`,
                color: copied ? "#86efac" : "#7070a0",
              }}>
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? "הועתק!" : "העתק"}
            </button>
            <button onClick={e => { e.stopPropagation(); onDelete(article.id); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
              <Trash2 size={11} /> מחק
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface Props { articles: SavedArticle[]; onDelete: (id: string) => void; onClearAll: () => void; }

export default function SavedArticles({ articles, onDelete, onClearAll }: Props) {
  const [copyAll, setCopyAll] = useState(false);

  async function handleCopyAll() {
    const text = articles.map(a =>
      [`=== ${a.headline} ===`, a.subhead, "", ...a.bullets.map(b=>`• ${b}`), "", a.body].join("\n")
    ).join("\n\n---\n\n");
    await navigator.clipboard.writeText(text);
    setCopyAll(true); setTimeout(() => setCopyAll(false), 2000);
  }

  return (
    <aside className="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0">
      <div className="rounded-2xl overflow-hidden sticky"
        style={{
          top: "116px",
          background: "#0a0b18",
          border: "1px solid rgba(139,92,246,0.25)",
          boxShadow: "0 0 40px rgba(139,92,246,0.08)",
          maxHeight: "calc(100vh - 140px)",
          display: "flex",
          flexDirection: "column",
        }}>

        {/* Header */}
        <div className="px-5 py-4 flex items-center gap-2"
          style={{ borderBottom: "1px solid rgba(139,92,246,0.18)", background: "rgba(139,92,246,0.08)" }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)" }}>
            <BookMarked size={13} className="text-white" />
          </div>
          <h2 className="text-sm font-black flex-1" style={{ color: "#e0e0f8" }}>ידיעות שמורות</h2>
          <span className="text-xs font-black px-2 py-0.5 rounded-full"
            style={{ background: "linear-gradient(135deg,#7c3aed,#3b82f6)", color: "#fff" }}>
            {articles.length}
          </span>
        </div>

        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center" style={{ color: "#3a3a60" }}>
            <ClipboardList size={38} className="mb-3 opacity-20" />
            <p className="text-sm font-bold">אין ידיעות שמורות</p>
            <p className="text-xs mt-1 opacity-60">כתוב ידיעה ולחץ "שמור"</p>
          </div>
        ) : (
          <>
            <div className="px-4 py-2 flex gap-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <button onClick={handleCopyAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: copyAll ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${copyAll ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.08)"}`,
                  color: copyAll ? "#86efac" : "#7070a0",
                }}>
                {copyAll ? <Check size={11} /> : <Copy size={11} />}
                {copyAll ? "הועתק!" : "העתק הכל"}
              </button>
              <button onClick={onClearAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)", color: "#f87171" }}>
                <Trash2 size={11} /> נקה הכל
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-3 space-y-2">
              {articles.map(a => <ArticleRow key={a.id} article={a} onDelete={onDelete} />)}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
