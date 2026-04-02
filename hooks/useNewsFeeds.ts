"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { NewsItem, Category } from "@/lib/types";
import { fetchAllFeedsFromAPI } from "@/lib/rss";

const REFRESH_INTERVAL = 15 * 60 * 1000;

// Stop words for deduplication
const STOP = new Set(["the","a","an","in","on","at","to","for","of","and","or","is","it","its","this","that","with","has","have","will","be","by","from","as","are","was","were","new","get","how","what","who","why","when","can","say","says","said"]);

function keyWords(title: string): Set<string> {
  return new Set(
    title.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(w => w.length > 3 && !STOP.has(w))
  );
}

function similarity(a: string, b: string): number {
  const wa = keyWords(a);
  const wb = keyWords(b);
  if (wa.size === 0 || wb.size === 0) return 0;
  const intersection = [...wa].filter(w => wb.has(w)).length;
  return intersection / Math.min(wa.size, wb.size);
}

function deduplicateItems(items: NewsItem[]): NewsItem[] {
  const kept: NewsItem[] = [];
  for (const item of items) {
    if (!kept.some(k => similarity(k.title, item.title) >= 0.6)) {
      kept.push(item);
    }
  }
  return kept;
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
    return items.map((item, i) => ({
      ...item,
      titleHe: translations[i] || undefined,
    }));
  } catch {
    return items;
  }
}

export function useNewsFeeds() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllFeedsFromAPI();
      const deduped = deduplicateItems(data);
      setItems(deduped);
      setLastUpdated(new Date());

      // Translate in background — updates items silently after they appear
      translateItems(deduped).then(translated => {
        setItems(translated);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch feeds");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    timerRef.current = setInterval(refresh, REFRESH_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [refresh]);

  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return {
    items: filteredItems,
    allItems: items,
    loading,
    error,
    lastUpdated,
    activeCategory,
    setActiveCategory,
    refresh,
  };
}
