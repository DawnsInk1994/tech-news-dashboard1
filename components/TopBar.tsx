"use client";

import { RefreshCw, Sun, Moon, Tag, WifiOff } from "lucide-react";

interface TopBarProps {
  lastUpdated: Date | null;
  loading: boolean;
  fromCache: boolean;
  onRefresh: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onOpenKeywords: () => void;
  keywordCount: number;
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
}

export default function TopBar({
  lastUpdated, loading, fromCache, onRefresh,
  theme, onToggleTheme, onOpenKeywords, keywordCount,
}: TopBarProps) {
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-50" style={{
      background: isDark
        ? "linear-gradient(135deg, #0d0f22 0%, #12103a 50%, #0d1228 100%)"
        : "linear-gradient(135deg, #f0f0ff 0%, #e8e0ff 50%, #e0eaff 100%)",
      borderBottom: isDark ? "1px solid rgba(139,92,246,0.25)" : "1px solid rgba(139,92,246,0.2)",
      boxShadow: isDark ? "0 2px 24px rgba(0,0,0,0.5)" : "0 2px 16px rgba(0,0,0,0.08)",
    }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">

        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="relative w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#8b5cf6,#3b82f6,#06b6d4)" }}>
            <span className="text-white font-black text-sm">ט</span>
            <span className="absolute -top-0.5 -left-0.5 w-2.5 h-2.5 rounded-full border-2"
              style={{
                background: fromCache ? "#f59e0b" : "#4ade80",
                borderColor: isDark ? "#0d0f22" : "#f0f0ff",
                animation: "pulse 2s infinite",
              }} />
          </div>
          <div>
            <h1 className="font-black text-lg leading-none tracking-tight"
              style={{ background: "linear-gradient(90deg,#c4b5fd,#93c5fd,#67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              מרכז חדשות טק
            </h1>
            <p className="text-[10px] leading-none mt-0.5 flex items-center gap-1"
              style={{ color: isDark ? "#5555aa" : "#8080c0" }}>
              {fromCache && <WifiOff size={9} />}
              {lastUpdated ? (fromCache ? `offline · ${formatTime(lastUpdated)}` : `עודכן ${formatTime(lastUpdated)}`) : "טוען…"}
            </p>
          </div>
        </div>

        <div className="flex-1" />

        {/* Keywords */}
        <button onClick={onOpenKeywords}
          className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: keywordCount > 0
              ? (isDark ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.12)")
              : (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"),
            border: keywordCount > 0 ? "1px solid rgba(139,92,246,0.4)" : "1px solid rgba(139,92,246,0.15)",
            color: keywordCount > 0 ? "#c4b5fd" : (isDark ? "#7070a0" : "#9090c0"),
          }}>
          <Tag size={13} />
          <span className="hidden sm:inline">מילות מפתח</span>
          {keywordCount > 0 && (
            <span className="flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-black"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#3b82f6)", color: "#fff" }}>
              {keywordCount}
            </span>
          )}
        </button>

        {/* Theme toggle */}
        <button onClick={onToggleTheme}
          className="flex items-center justify-center w-9 h-9 rounded-lg transition-all"
          style={{
            background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
            border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
            color: isDark ? "#c4b5fd" : "#7c3aed",
          }}>
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Refresh */}
        <button onClick={onRefresh} disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: loading
              ? (isDark ? "rgba(139,92,246,0.1)" : "rgba(139,92,246,0.08)")
              : (isDark ? "rgba(139,92,246,0.15)" : "rgba(139,92,246,0.12)"),
            border: "1px solid rgba(139,92,246,0.3)",
            color: loading ? "#6644aa" : "#8b5cf6",
            cursor: loading ? "not-allowed" : "pointer",
          }}>
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          <span className="hidden sm:inline">{loading ? "טוען…" : "רענן"}</span>
        </button>
      </div>
    </header>
  );
}
