"use client";

import { RefreshCw } from "lucide-react";

interface TopBarProps {
  lastUpdated: Date | null;
  loading: boolean;
  onRefresh: () => void;
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
}

export default function TopBar({ lastUpdated, loading, onRefresh }: TopBarProps) {
  return (
    <header className="sticky top-0 z-50" style={{
      background: "linear-gradient(135deg, #0d0f22 0%, #12103a 50%, #0d1228 100%)",
      borderBottom: "1px solid rgba(139,92,246,0.25)",
      boxShadow: "0 2px 24px rgba(0,0,0,0.5)",
    }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">

        {/* Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="relative w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#8b5cf6,#3b82f6,#06b6d4)" }}>
            <span className="text-white font-black text-sm">ט</span>
            <span className="absolute -top-0.5 -left-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2"
              style={{ borderColor: "#0d0f22", animation: "pulse 2s infinite" }} />
          </div>
          <div>
            <h1 className="font-black text-lg leading-none tracking-tight"
              style={{ background: "linear-gradient(90deg,#c4b5fd,#93c5fd,#67e8f9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              מרכז חדשות טק
            </h1>
            {lastUpdated && (
              <p className="text-[10px] leading-none mt-0.5" style={{ color: "#5555aa" }}>
                עודכן {formatTime(lastUpdated)}
              </p>
            )}
          </div>
        </div>

        <div className="flex-1" />

        {/* Refresh */}
        <button onClick={onRefresh} disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: loading ? "rgba(139,92,246,0.1)" : "rgba(139,92,246,0.15)",
            border: "1px solid rgba(139,92,246,0.3)",
            color: loading ? "#6644aa" : "#c4b5fd",
            cursor: loading ? "not-allowed" : "pointer",
          }}>
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          <span className="hidden sm:inline">{loading ? "טוען…" : "רענן"}</span>
        </button>
      </div>
    </header>
  );
}
