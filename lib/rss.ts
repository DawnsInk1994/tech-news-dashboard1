import type { NewsItem } from "./types";

const CACHE_KEY = "tn-articles-cache";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function saveToCache(items: NewsItem[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ items, ts: Date.now() }));
  } catch {}
}

export function loadFromCache(): NewsItem[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    const { items, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return [];
    return items ?? [];
  } catch {
    return [];
  }
}

export async function fetchAllFeedsFromAPI(): Promise<NewsItem[]> {
  const res = await fetch("/api/feeds", { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`Feed API error: ${res.status}`);
  const items: NewsItem[] = await res.json();
  if (typeof window !== "undefined") saveToCache(items);
  return items;
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "עכשיו";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `לפני ${minutes} דקות`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `לפני ${hours} שעות`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `לפני ${days} ימים`;
  return date.toLocaleDateString("he-IL");
}
