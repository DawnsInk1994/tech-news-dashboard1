"use client";

import { useState } from "react";
import { X, Plus, Tag } from "lucide-react";
import { MAX_KEYWORDS, setKeywords } from "@/lib/keywords";

interface Props {
  keywords: string[];
  onChange: (kws: string[]) => void;
  onClose: () => void;
}

export default function KeywordManager({ keywords, onChange, onClose }: Props) {
  const [draft, setDraft] = useState("");

  function add() {
    const kw = draft.trim();
    if (!kw || keywords.includes(kw) || keywords.length >= MAX_KEYWORDS) return;
    const next = [...keywords, kw];
    setKeywords(next);
    onChange(next);
    setDraft("");
  }

  function remove(kw: string) {
    const next = keywords.filter(k => k !== kw);
    setKeywords(next);
    onChange(next);
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="fixed top-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 z-50 rounded-2xl p-5 animate-slide-up"
        style={{
          background: "var(--bg-card, #0e0f1c)",
          border: "1px solid rgba(139,92,246,0.3)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Tag size={14} style={{ color: "#8b5cf6" }} />
            <span className="text-sm font-bold" style={{ color: "var(--txt-primary, #ddddf0)" }}>
              מילות מפתח
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:opacity-60 transition-opacity">
            <X size={14} style={{ color: "#7070a0" }} />
          </button>
        </div>

        <p className="text-[11px] mb-3" style={{ color: "#5050a0" }}>
          כתבות שמכילות את המילים האלו יסומנו ויוצגו ראשונות (עד {MAX_KEYWORDS} מילות מפתח)
        </p>

        {/* Existing keywords */}
        <div className="flex flex-wrap gap-2 mb-3 min-h-[28px]">
          {keywords.map(kw => (
            <span
              key={kw}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: "rgba(139,92,246,0.18)", border: "1px solid rgba(139,92,246,0.35)", color: "#c4b5fd" }}
            >
              {kw}
              <button onClick={() => remove(kw)} className="hover:opacity-60 transition-opacity">
                <X size={10} />
              </button>
            </span>
          ))}
          {keywords.length === 0 && (
            <span className="text-[11px]" style={{ color: "#404060" }}>אין מילות מפתח</span>
          )}
        </div>

        {/* Add input */}
        {keywords.length < MAX_KEYWORDS && (
          <div className="flex gap-2">
            <input
              type="text"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => e.key === "Enter" && add()}
              placeholder="הוסף מילת מפתח…"
              dir="rtl"
              className="flex-1 text-sm px-3 py-2 rounded-xl outline-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "var(--txt-primary, #ddddf0)",
                caretColor: "#8b5cf6",
              }}
            />
            <button
              onClick={add}
              disabled={!draft.trim()}
              className="p-2 rounded-xl transition-all"
              style={{
                background: draft.trim() ? "linear-gradient(135deg,#7c3aed,#8b5cf6)" : "rgba(255,255,255,0.05)",
                color: draft.trim() ? "#fff" : "#404060",
              }}
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
