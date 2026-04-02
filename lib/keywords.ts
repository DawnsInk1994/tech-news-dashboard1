const KEY = "tn-keywords";
export const MAX_KEYWORDS = 5;

export function getKeywords(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); }
  catch { return []; }
}

export function setKeywords(kws: string[]): void {
  localStorage.setItem(KEY, JSON.stringify(kws.slice(0, MAX_KEYWORDS)));
}

/** Returns the first matching keyword, or null */
export function matchesKeyword(text: string, keywords: string[]): string | null {
  if (!keywords.length) return null;
  const lower = text.toLowerCase();
  return keywords.find(kw => kw && lower.includes(kw.toLowerCase())) ?? null;
}
