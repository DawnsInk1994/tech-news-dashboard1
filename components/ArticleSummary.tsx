"use client";

import { useState } from "react";
import { X, ExternalLink, Loader2, Sparkles, AlertCircle } from "lucide-react";
import type { NewsItem } from "@/lib/types";

interface Props {
  item: NewsItem;
  onClose: () => void;
}

interface Summary {
  summary: string;
  bullets: string[];
  significance: string;
}

const CAT_GRADIENTS: Record<string, string> = {
  ai:            "linear-gradient(135deg,#7c3aed,#a855f7)",
  social:        "linear-gradient(135deg,#1d4ed8,#3b82f6)",
  security:      "linear-gradient(135deg,#b91c1c,#ef4444)",
  space:         "linear-gradient(135deg,#0f766e,#14b8a6)",
  siliconvalley: "linear-gradient(135deg,#b45309,#f59e0b)",
  radar:         "linear-gradient(135deg,#be185d,#ec4899)",
};

export default function ArticleSummary({ item, onClose }: Props) {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gradient = CAT_GRADIENTS[item.category] ?? "linear-gradient(135deg,#6366f1,#8b5cf6)";

  async function fetchSummary() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: item.title, summary: item.summary, source: item.source }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? `שגיאה ${res.status}`);
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "שגיאה לא ידועה");
    } finally {
      setLoading(false);
    }
  }

  // Auto-fetch on mount
  if (!data && !loading && !error) fetchSummary();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden animate-slide-up"
        style={{
          background: "var(--bg-card, #0e0f1c)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.6)",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        {/* Coloured top strip */}
        <div className="h-1.5" style={{ background: gradient }} />

        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={13} style={{ color: "#8b5cf6" }} />
              <span className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#8b5cf6" }}>
                סיכום AI
              </span>
              <span className="text-[11px]" style={{ color: "#404060" }}>· {item.source}</span>
            </div>
            <h3 className="text-sm font-bold leading-snug" style={{ color: "var(--txt-primary, #ddddf0)" }} dir="rtl">
              {item.titleHe ?? item.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1.5 rounded-lg transition-opacity hover:opacity-60"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <X size={15} style={{ color: "#7070a0" }} />
          </button>
        </div>

        <div className="px-5 pb-6">
          {/* Loading */}
          {loading && (
            <div className="flex items-center gap-3 py-8 justify-center">
              <Loader2 size={18} className="animate-spin" style={{ color: "#8b5cf6" }} />
              <span className="text-sm" style={{ color: "#6060a0" }}>מסכם בעברית…</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl mb-4"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <AlertCircle size={14} style={{ color: "#f87171", flexShrink: 0, marginTop: 1 }} />
              <div>
                <p className="text-xs font-semibold" style={{ color: "#f87171" }}>לא ניתן לסכם</p>
                <p className="text-[11px] mt-0.5" style={{ color: "#7070a0" }}>
                  {error.includes("credit") || error.includes("balance")
                    ? "יש להוסיף קרדיט ב-console.anthropic.com"
                    : error}
                </p>
              </div>
            </div>
          )}

          {/* Summary content */}
          {data && (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: "var(--txt-secondary, #9898c0)" }} dir="rtl">
                {data.summary}
              </p>

              <div className="space-y-2">
                {data.bullets.map((b, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundImage: gradient }} />
                    <p className="text-sm" style={{ color: "var(--txt-secondary, #9898c0)" }} dir="rtl">{b}</p>
                  </div>
                ))}
              </div>

              {data.significance && (
                <div className="p-3 rounded-xl" style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}>
                  <p className="text-[11px] font-black uppercase tracking-widest mb-1" style={{ color: "#6040a0" }}>למה זה חשוב</p>
                  <p className="text-xs leading-relaxed" style={{ color: "#a0a0cc" }} dir="rtl">{data.significance}</p>
                </div>
              )}
            </div>
          )}

          {/* CTA */}
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold mt-5 transition-all hover:opacity-90"
            style={{ background: gradient, color: "#fff", boxShadow: "0 2px 16px rgba(139,92,246,0.35)" }}
          >
            <ExternalLink size={14} />
            קרא את המאמר המלא
          </a>
        </div>
      </div>
    </>
  );
}
