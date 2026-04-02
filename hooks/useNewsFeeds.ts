"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { NewsItem, Category } from "@/lib/types";
import { fetchAllFeedsFromAPI, loadFromCache } from "@/lib/rss";

const REFRESH_INTERVAL = 15 * 60 * 1000;

const STOP = new Set(["the","a","an","in","on","at","to","for","of","and","or","is","it","its","this","that","with","has","have","will","be","by","from","as","are","was","were","new","get","how","what","who","why","when","can","say","says","said"]);

function keyWords(title: string): Set<string> {
  return new Set(title.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(w => w.length > 3 && !STOP.has(w)));
}

function similarity(a: string, b: string): number {
  const wa = keyWords(a), wb = keyWords(b);
  if (!wa.size || !wb.size) return 0;
  return [...wa].filter(w => wb.has(w)).length / Math.min(wa.size, wb.size);
}

/** Group similar articles, tag the representative with trendScore */
function scoreAndDeduplicate(items: NewsItem[]): NewsItem[] {
  const groups: NewsItem[][] = [];
  for (const item of items) {
    const g = groups.find(g => similarity(g[0].title, item.title) >= 0.6);
    if (g) g.push(item);
    else groups.push([item]);
  }
  return groups.map(g => ({ ...g[0], trendScore: g.length }));
}

async function translateItems(items: NewsItem[]): Promise<NewsItem[]> {
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titles: items.map(i => i.title) }),
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) return items;
    const { translations } = await res.json();
    if (!translations?.length) return items;
    return items.map((item, i) => ({ ...item, titleHe: translations[i] || undefined }));
  } catch {
    return items;
  }
}

export type SortMode = "date" | "importance";

export function useNewsFeeds() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [sortMode, setSortMode] = useState<SortMode>("date");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setFromCache(false);
    try {
      const data = await fetchAllFeedsFromAPI();
      const processed = scoreAndDeduplicate(data);
      setItems(processed);
      setLastUpdated(new Date());
      translateItems(processed).then(t => setItems(t));
    } catch {
      // Offline fallback
      const cached = loadFromCache();
      if (cached.length) {
        setItems(scoreAndDeduplicate(cached));
        setFromCache(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    timerRef.current = setInterval(refresh, REFRESH_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [refresh]);

  // Sort
  const sorted = sortMode === "importance"
    ? [...items].sort((a, b) => (b.trendScore ?? 1) - (a.trendScore ?? 1))
    : items;

  // Category filter
  const filteredItems = activeCategory === "all"
    ? sorted
    : sorted.filter(item => item.category === activeCategory);

  return {
    items: filteredItems,
    allItems: items,
    loading,
    fromCache,
    lastUpdated,
    activeCategory,
    setActiveCategory,
    sortMode,
    setSortMode,
    refresh,
  };
}
