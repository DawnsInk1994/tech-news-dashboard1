const KEY = "tn-read-articles";
const MAX = 1000;

export function getReadArticles(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

export function markAsRead(link: string): void {
  const read = getReadArticles();
  read.add(link);
  const arr = [...read].slice(-MAX);
  localStorage.setItem(KEY, JSON.stringify(arr));
}
