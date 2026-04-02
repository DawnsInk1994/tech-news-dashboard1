import type { SavedArticle } from "./types";

const STORAGE_KEY = "tech_news_saved_articles";

export function getSavedArticles(): SavedArticle[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedArticle[];
  } catch {
    return [];
  }
}

export function saveArticle(article: SavedArticle): void {
  if (typeof window === "undefined") return;
  const existing = getSavedArticles();
  // Avoid duplicates by id
  const filtered = existing.filter((a) => a.id !== article.id);
  const updated = [article, ...filtered];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteArticle(id: string): void {
  if (typeof window === "undefined") return;
  const existing = getSavedArticles();
  const updated = existing.filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearAllArticles(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function generateArticleId(): string {
  return `article_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
