"use client";

import { Search, X, Clock, EyeOff, TrendingUp } from "lucide-react";
import type { SortMode } from "@/hooks/useNewsFeeds";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  todayOnly: boolean;
  onToggleTodayOnly: () => void;
  hideRead: boolean;
  onToggleHideRead: () => void;
  sortMode: SortMode;
  onToggleSort: () => void;
  resultCount: number;
}

export default function SearchBar({
  value, onChange, todayOnly, onToggleTodayOnly,
  hideRead, onToggleHideRead, sortMode, onToggleSort, resultCount,
}: SearchBarProps) {
  const btnBase = "flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold flex-shrink-0 transition-all";
  const btnActive = { background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "1px solid transparent", color: "#fff", boxShadow: "0 0 14px rgba(139,92,246,0.35)" };
  const btnInactive = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "#6060a0" };

  return (
    <div className="sticky z-30" style={{
      top: "116px",
      background: "rgba(7,8,15,0.97)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center gap-2">
          {/* Search input */}
          <div className="relative flex-1 max-w-lg">
            <Search size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#4a4a80" }} />
            <input
              type="text"
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder="חפש ידיעות…"
              dir="rtl"
              className="w-full text-sm pr-10 pl-9 py-2.5 rounded-xl outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: value ? "1px solid rgba(139,92,246,0.45)" : "1px solid rgba(255,255,255,0.09)",
                color: "var(--txt-primary, #ddddf0)",
                caretColor: "#8b5cf6",
                boxShadow: value ? "0 0 0 3px rgba(139,92,246,0.1)" : "none",
              }}
            />
            {value && (
              <button onClick={() => onChange("")} className="absolute left-3 top-1/2 -translate-y-1/2 hover:opacity-60 transition-opacity">
                <X size={13} style={{ color: "#7070a0" }} />
              </button>
            )}
          </div>

          {/* Today toggle */}
          <button onClick={onToggleTodayOnly} className={btnBase} style={todayOnly ? btnActive : btnInactive}>
            <Clock size={12} />
            <span className="hidden sm:inline">היום</span>
          </button>

          {/* Hide read toggle */}
          <button onClick={onToggleHideRead} className={btnBase} style={hideRead ? btnActive : btnInactive}>
            <EyeOff size={12} />
            <span className="hidden sm:inline">הסתר נקראו</span>
          </button>

          {/* Sort toggle */}
          <button onClick={onToggleSort} className={btnBase}
            style={sortMode === "importance" ? btnActive : btnInactive}
            title={sortMode === "importance" ? "מיון לפי חשיבות" : "מיון לפי תאריך"}>
            <TrendingUp size={12} />
            <span className="hidden sm:inline">{sortMode === "importance" ? "חשיבות" : "תאריך"}</span>
          </button>
        </div>

        {(value || todayOnly || hideRead) && (
          <p className="text-[11px] mt-1.5 pr-1" style={{ color: "#4a4a80" }}>
            {resultCount > 0 ? `נמצאו ${resultCount} ידיעות` : "לא נמצאו ידיעות"}
          </p>
        )}
      </div>
    </div>
  );
}
