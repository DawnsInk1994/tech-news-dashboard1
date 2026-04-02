"use client";

import type { Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";
import { Bookmark } from "lucide-react";

export type ActiveTab = Category | "all" | "saved";

interface CategoryFilterProps {
  active: ActiveTab;
  onChange: (cat: ActiveTab) => void;
  counts: Record<string, number>;
  savedCount: number;
}

const ALL_CAT = {
  id: "all" as const,
  labelHe: "הכל",
  gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)",
  glow: "rgba(99,102,241,0.4)",
};

const GRADIENTS: Record<string, { gradient: string; glow: string }> = {
  ai:            { gradient: "linear-gradient(135deg,#7c3aed,#a855f7)", glow: "rgba(168,85,247,0.45)" },
  social:        { gradient: "linear-gradient(135deg,#1d4ed8,#3b82f6)", glow: "rgba(59,130,246,0.45)" },
  security:      { gradient: "linear-gradient(135deg,#b91c1c,#ef4444)", glow: "rgba(239,68,68,0.45)"  },
  space:         { gradient: "linear-gradient(135deg,#0f766e,#14b8a6)", glow: "rgba(20,184,166,0.45)" },
  siliconvalley: { gradient: "linear-gradient(135deg,#b45309,#f59e0b)", glow: "rgba(245,158,11,0.45)" },
  radar:         { gradient: "linear-gradient(135deg,#be185d,#ec4899)", glow: "rgba(236,72,153,0.45)" },
};

export default function CategoryFilter({ active, onChange, counts, savedCount }: CategoryFilterProps) {
  const pills = [ALL_CAT, ...CATEGORIES.map(c => ({ ...c, ...GRADIENTS[c.id] }))];

  return (
    <div className="sticky z-40" style={{
      top: "64px",
      background: "rgba(7,8,15,0.97)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {pills.map((cat) => {
            const isActive = active === cat.id;
            const count = cat.id === "all" ? counts._total : counts[cat.id];
            return (
              <button key={cat.id}
                onClick={() => onChange(cat.id as ActiveTab)}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200"
                style={{
                  background: isActive ? cat.gradient : "rgba(255,255,255,0.05)",
                  border: isActive ? "1px solid transparent" : "1px solid rgba(255,255,255,0.1)",
                  color: isActive ? "#fff" : "#7070a0",
                  boxShadow: isActive ? `0 0 18px ${cat.glow}, 0 2px 8px rgba(0,0,0,0.4)` : "none",
                  transform: isActive ? "scale(1.04)" : "scale(1)",
                }}>
                {cat.labelHe}
                {count !== undefined && (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                    style={{
                      background: isActive ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.07)",
                      color: isActive ? "#fff" : "#505070",
                    }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}

          {/* Saved tab */}
          <button
            onClick={() => onChange("saved")}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200"
            style={{
              background: active === "saved" ? "linear-gradient(135deg,#4f46e5,#7c3aed)" : "rgba(255,255,255,0.05)",
              border: active === "saved" ? "1px solid transparent" : "1px solid rgba(255,255,255,0.1)",
              color: active === "saved" ? "#fff" : "#7070a0",
              boxShadow: active === "saved" ? "0 0 18px rgba(99,102,241,0.4), 0 2px 8px rgba(0,0,0,0.4)" : "none",
              transform: active === "saved" ? "scale(1.04)" : "scale(1)",
            }}>
            <Bookmark size={11} />
            שמורות
            {savedCount > 0 && (
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                style={{
                  background: active === "saved" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.07)",
                  color: active === "saved" ? "#fff" : "#505070",
                }}>
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
