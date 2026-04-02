"use client";

import { Search, X, Clock } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  todayOnly: boolean;
  onToggleTodayOnly: () => void;
  resultCount: number;
}

export default function SearchBar({ value, onChange, todayOnly, onToggleTodayOnly, resultCount }: SearchBarProps) {
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
          <div className="relative flex-1 max-w-xl">
            <Search size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "#4a4a80" }} />
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
                color: "#ddddf0",
                caretColor: "#8b5cf6",
                boxShadow: value ? "0 0 0 3px rgba(139,92,246,0.1)" : "none",
              }}
            />
            {value && (
              <button onClick={() => onChange("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60">
                <X size={13} style={{ color: "#7070a0" }} />
              </button>
            )}
          </div>

          {/* Today only toggle */}
          <button
            onClick={onToggleTodayOnly}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold flex-shrink-0 transition-all"
            style={{
              background: todayOnly ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.05)",
              border: todayOnly ? "1px solid transparent" : "1px solid rgba(255,255,255,0.09)",
              color: todayOnly ? "#fff" : "#6060a0",
              boxShadow: todayOnly ? "0 0 14px rgba(139,92,246,0.35)" : "none",
            }}
          >
            <Clock size={12} />
            היום
          </button>
        </div>

        {(value || todayOnly) && (
          <p className="text-[11px] mt-1.5 pr-1" style={{ color: "#4a4a80" }}>
            {resultCount > 0 ? `נמצאו ${resultCount} ידיעות` : "לא נמצאו ידיעות"}
          </p>
        )}
      </div>
    </div>
  );
}
