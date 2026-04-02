"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { NewsItem, Category } from "@/lib/types";
import { fetchAllFeedsFromAPI } from "@/lib/rss";

const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

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
      setItems(data);
      setLastUpdated(new Date());
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
