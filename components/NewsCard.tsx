"use client";

import { ExternalLink } from "lucide-react";
import type { NewsItem } from "@/lib/types";
import { CATEGORY_MAP } from "@/lib/categories";
import { timeAgo } from "@/lib/rss";

const CAT_GRADIENTS: Record<string, string> = {
  ai:            "linear-gradient(90deg,#7c3aed,#a855f7,#38bdf8)",
  social:        "linear-gradient(90deg,#1d4ed8,#3b82f6,#38bdf8)",
  security:      "linear-gradient(90deg,#b91c1c,#ef4444,#f97316)",
  space:         "linear-gradient(90deg,#0f766e,#14b8a6,#38bdf8)",
  siliconvalley: "linear-gradient(90deg,#b45309,#f59e0b,#fde68a)",
  radar:         "linear-gradient(90deg,#be185d,#ec4899,#f43f5e)",
};

export default function NewsCard({ item }: { item: NewsItem }) {
  const cat = CATEGORY_MAP[item.category];
  const gradient = CAT_GRADIENTS[item.category] ?? "linear-gradient(90deg,#6366f1,#8b5cf6)";

  return (
    <article
      className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
      style={{
        background: "#0e0f1c",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* Coloured top bar */}
      <div className="h-1" style={{ background: gradient }} />

      {/* Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Meta row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest"
            style={{ background: gradient, color: "#fff", letterSpacing: "0.08em" }}
          >
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
          <h2
            className="text-base font-bold leading-snug group-hover:opacity-80 transition-opacity"
            style={{ color: "#ddddf0" }}
          >
            {item.title}
          </h2>
        </a>

        {/* Summary */}
        {item.summary && (
          <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "#6a6a98" }}>
            {item.summary}
          </p>
        )}
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />

      {/* Action row */}
      <div className="px-5 py-3.5">
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold transition-all hover:opacity-90"
          style={{
            background: gradient,
            color: "#fff",
            boxShadow: "0 2px 12px rgba(139,92,246,0.3)",
          }}
        >
          <ExternalLink size={13} />
          קרא את הכתבה המלאה
        </a>
      </div>
    </article>
  );
}
