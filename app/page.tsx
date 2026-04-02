"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import TopBar from "@/components/TopBar";
import CategoryFilter, { type ActiveTab } from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import NewsGrid from "@/components/NewsGrid";
import KeywordManager from "@/components/KeywordManager";
import type { Category } from "@/lib/types";
import { useNewsFeeds } from "@/hooks/useNewsFeeds";
import { CATEGORIES } from "@/lib/categories";
import { getReadArticles, getSavedLinks } from "@/lib/readArticles";
import { getKeywords } from "@/lib/keywords";
import { matchesKeyword } from "@/lib/keywords";

const DAY_MS = 24 * 60 * 60 * 1000;

function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const stored = localStorage.getItem("tn-theme") as "dark" | "light" | null;
    if (stored) setTheme(stored);
  }, []);
  const toggle = useCallback(() => {
    setTheme(t => {
      const next = t === "dark" ? "light" : "dark";
      localStorage.setItem("tn-theme", next);
      return next;
    });
  }, []);
  return { theme, toggle };
}

export default function HomePage() {
  const { items, allItems, loading, fromCache, lastUpdated, activeCategory, setActiveCategory, sortMode, setSortMode, refresh } =
    useNewsFeeds();

  const { theme, toggle: toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [todayOnly, setTodayOnly] = useState(false);
  const [hideRead, setHideRead] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [showKeywords, setShowKeywords] = useState(false);

  // Read from localStorage on mount
  useEffect(() => { setKeywords(getKeywords()); }, []);

  const handleTabChange = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
    setSearchQuery("");
    if (tab !== "saved") setActiveCategory(tab === "all" ? "all" : tab as Category);
  }, [setActiveCategory]);

  // Category counts
  const counts: Record<string, number> = { _total: allItems.length };
  for (const cat of CATEGORIES) counts[cat.id] = allItems.filter(i => i.category === cat.id).length;

  // Saved links (re-read each render is cheap since it's a localStorage read)
  const savedLinks = typeof window !== "undefined" ? getSavedLinks() : new Set<string>();
  const savedCount = savedLinks.size;

  // Build filtered list
  const q = searchQuery.trim().toLowerCase();
  const now = Date.now();
  const readSet = typeof window !== "undefined" ? getReadArticles() : new Set<string>();

  const filteredItems = useMemo(() => {
    let list = activeTab === "saved"
      ? allItems.filter(i => savedLinks.has(i.link))
      : items;

    // Keyword-matched items float to top
    if (keywords.length) {
      const matched = list.filter(i => matchesKeyword((i.titleHe ?? i.title) + " " + i.summary, keywords));
      const rest = list.filter(i => !matchesKeyword((i.titleHe ?? i.title) + " " + i.summary, keywords));
      list = [...matched, ...rest];
    }

    return list.filter(i => {
      if (hideRead && readSet.has(i.link)) return false;
      if (todayOnly && now - new Date(i.pubDate).getTime() > DAY_MS) return false;
      if (q && !(
        (i.titleHe ?? i.title).toLowerCase().includes(q) ||
        i.title.toLowerCase().includes(q) ||
        (i.summary ?? "").toLowerCase().includes(q) ||
        i.source.toLowerCase().includes(q)
      )) return false;
      return true;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, allItems, activeTab, keywords, hideRead, todayOnly, q]);

  // Apply theme CSS vars to root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.style.setProperty("--bg-base",      "#f4f4fb");
      root.style.setProperty("--bg-surface",   "#ffffff");
      root.style.setProperty("--bg-card",      "#ffffff");
      root.style.setProperty("--txt-primary",  "#1a1a3a");
      root.style.setProperty("--txt-secondary","#4a4a70");
      root.style.setProperty("--txt-muted",    "#9090b0");
      root.style.setProperty("--border-dim",   "rgba(0,0,0,0.07)");
    } else {
      root.style.setProperty("--bg-base",      "#07080f");
      root.style.setProperty("--bg-surface",   "#0e0f1c");
      root.style.setProperty("--bg-card",      "#0e0f1c");
      root.style.setProperty("--txt-primary",  "#eeeef8");
      root.style.setProperty("--txt-secondary","#9898c0");
      root.style.setProperty("--txt-muted",    "#4a4a70");
      root.style.setProperty("--border-dim",   "rgba(255,255,255,0.07)");
    }
  }, [theme]);

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: "var(--bg-base)" }}>
      <TopBar
        lastUpdated={lastUpdated}
        loading={loading}
        fromCache={fromCache}
        onRefresh={refresh}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenKeywords={() => setShowKeywords(true)}
        keywordCount={keywords.length}
      />

      <CategoryFilter
        active={activeTab}
        onChange={handleTabChange}
        counts={counts}
        savedCount={savedCount}
      />

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        todayOnly={todayOnly}
        onToggleTodayOnly={() => setTodayOnly(v => !v)}
        hideRead={hideRead}
        onToggleHideRead={() => setHideRead(v => !v)}
        sortMode={sortMode}
        onToggleSort={() => setSortMode(s => s === "date" ? "importance" : "date")}
        resultCount={filteredItems.length}
      />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        <NewsGrid items={filteredItems} loading={loading} keywords={keywords} />

        {loading && items.length > 0 && (
          <div className="flex justify-center py-6">
            <div className="text-xs px-3 py-1.5 rounded-full"
              style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa" }}>
              מעדכן…
            </div>
          </div>
        )}
      </main>

      {showKeywords && (
        <KeywordManager
          keywords={keywords}
          onChange={setKeywords}
          onClose={() => setShowKeywords(false)}
        />
      )}

      <footer className="text-center py-6 text-xs"
        style={{ color: "var(--txt-muted)", borderTop: "1px solid var(--border-dim)", marginTop: "2rem" }}>
        מרכז חדשות טק · מרענן אוטומטית כל 15 דקות
      </footer>
    </div>
  );
}
