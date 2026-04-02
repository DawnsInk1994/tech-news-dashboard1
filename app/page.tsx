"use client";

import { useState, useCallback } from "react";
import TopBar from "@/components/TopBar";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import NewsGrid from "@/components/NewsGrid";
import type { Category } from "@/lib/types";
import { useNewsFeeds } from "@/hooks/useNewsFeeds";
import { CATEGORIES } from "@/lib/categories";

export default function HomePage() {
  const { items, allItems, loading, lastUpdated, activeCategory, setActiveCategory, refresh } =
    useNewsFeeds();

  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryChange = useCallback(
    (cat: Category | "all") => {
      setActiveCategory(cat);
      setSearchQuery(""); // clear search when switching category
    },
    [setActiveCategory]
  );

  // Build category counts from all items
  const counts: Record<string, number> = { _total: allItems.length };
  for (const cat of CATEGORIES) {
    counts[cat.id] = allItems.filter((i) => i.category === cat.id).length;
  }

  // Search filter on top of category filter
  const q = searchQuery.trim().toLowerCase();
  const filteredItems = q
    ? items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          (i.summary ?? "").toLowerCase().includes(q) ||
          i.source.toLowerCase().includes(q)
      )
    : items;

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0f" }}>
      <TopBar
        lastUpdated={lastUpdated}
        loading={loading}
        onRefresh={refresh}
      />

      <CategoryFilter
        active={activeCategory}
        onChange={handleCategoryChange}
        counts={counts}
      />

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        resultCount={filteredItems.length}
      />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        <NewsGrid items={filteredItems} loading={loading} />

        {loading && items.length > 0 && (
          <div className="flex justify-center py-6">
            <div
              className="text-xs px-3 py-1.5 rounded-full"
              style={{
                background: "rgba(124,58,237,0.1)",
                border: "1px solid rgba(124,58,237,0.2)",
                color: "#a78bfa",
              }}
            >
              מעדכן…
            </div>
          </div>
        )}
      </main>

      <footer
        className="text-center py-6 text-xs"
        style={{
          color: "#303050",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          marginTop: "2rem",
        }}
      >
        מרכז חדשות טק · מרענן אוטומטית כל 15 דקות
      </footer>
    </div>
  );
}
