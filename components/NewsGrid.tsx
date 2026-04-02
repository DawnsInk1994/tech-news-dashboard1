"use client";

import type { NewsItem } from "@/lib/types";
import NewsCard from "./NewsCard";
import { NewsGridSkeleton } from "./LoadingSkeleton";
import { Inbox } from "lucide-react";

interface NewsGridProps {
  items: NewsItem[];
  loading: boolean;
  keywords: string[];
}

export default function NewsGrid({ items, loading, keywords }: NewsGridProps) {
  if (loading && items.length === 0) return <NewsGridSkeleton />;

  if (!loading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center" style={{ color: "#505070" }}>
        <Inbox size={40} className="mb-4 opacity-30" />
        <p className="text-sm font-medium">אין ידיעות להצגה</p>
        <p className="text-xs mt-1 opacity-70">נסה לבחור קטגוריה אחרת או לרענן</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map(item => (
        <NewsCard key={item.link || item.id} item={item} keywords={keywords} />
      ))}
    </div>
  );
}
