const READ_KEY  = "tn-read-articles";
const SAVED_KEY = "tn-saved-articles";
const MAX = 1000;

// ── Read tracking ──────────────────────────────────────────────
export function getReadArticles(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try { return new Set(JSON.parse(localStorage.getItem(READ_KEY) ?? "[]")); }
  catch { return new Set(); }
}

export function markAsRead(link: string): void {
  const read = getReadArticles();
  read.add(link);
  localStorage.setItem(READ_KEY, JSON.stringify([...read].slice(-MAX)));
}

// ── Bookmarks ──────────────────────────────────────────────────
export function getSavedLinks(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try { return new Set(JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]")); }
  catch { return new Set(); }
}

export function toggleSaveArticle(link: string): boolean {
  const saved = getSavedLinks();
  if (saved.has(link)) saved.delete(link);
  else saved.add(link);
  localStorage.setItem(SAVED_KEY, JSON.stringify([...saved]));
  return saved.has(link);
}
