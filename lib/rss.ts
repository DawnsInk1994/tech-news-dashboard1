import type { NewsItem } from "./types";

export async function fetchAllFeedsFromAPI(): Promise<NewsItem[]> {
  const res = await fetch("/api/feeds", { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`Feed API error: ${res.status}`);
  return res.json();
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
