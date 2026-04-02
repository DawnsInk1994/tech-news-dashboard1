import { NextRequest, NextResponse } from "next/server";
import type { NewsItem } from "@/lib/types";
import type { Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";

// Simple RSS/Atom XML parser — no external deps
function extractTag(xml: string, tag: string): string {
  // Try CDATA first
  const cdataRe = new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>`, "i");
  const cdataMatch = xml.match(cdataRe);
  if (cdataMatch) return cdataMatch[1].trim();

  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = xml.match(re);
  return match ? match[1].trim() : "";
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const re = new RegExp(`<${tag}[^>]*\\s${attr}=["']([^"']*)["'][^>]*>`, "i");
  const match = xml.match(re);
  return match ? match[1] : "";
}

function stripHtml(html: string): string {
  return html
    // Decode entities first so double-encoded HTML gets cleaned too
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    // Now strip all HTML tags
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseRSS(xml: string, feedUrl: string, category: Category, sourceName: string): NewsItem[] {
  const items: NewsItem[] = [];

  // Handle both RSS <item> and Atom <entry>
  const itemPattern = /<(?:item|entry)[\s>]([\s\S]*?)<\/(?:item|entry)>/gi;
  let match;

  while ((match = itemPattern.exec(xml)) !== null) {
    const block = match[1];

    const title = stripHtml(extractTag(block, "title") || "");
    if (!title) continue;

    // Link — RSS uses <link>, Atom uses <link href="..."/>
    let link = extractTag(block, "link");
    if (!link) link = extractAttr(block, "link", "href");
    link = link.trim();

    // Date — RSS pubDate, Atom updated/published
    const pubDate =
      extractTag(block, "pubDate") ||
      extractTag(block, "published") ||
      extractTag(block, "updated") ||
      new Date().toISOString();

    // Summary
    const rawDesc =
      extractTag(block, "description") ||
      extractTag(block, "summary") ||
      extractTag(block, "content");
    const summary = stripHtml(rawDesc).slice(0, 200).trimEnd() + (rawDesc.length > 200 ? "…" : "");

    // ID — include category + link to guarantee uniqueness across feeds
    const guid = extractTag(block, "guid") || extractTag(block, "id") || link;
    const id = Buffer.from(`${category}:${guid}`.slice(-80))
      .toString("base64")
      .replace(/[^a-zA-Z0-9]/g, "")
      .slice(0, 20);

    items.push({ id, title, summary, link, pubDate, source: sourceName, category });
  }

  return items;
}

function sourceNameFromUrl(url: string): string {
  const overrides: Record<string, string> = {
    "hnrss.org": "Hacker News",
    "lobste.rs": "Lobsters",
    "blog.google": "Google AI Blog",
    "a16z.com": "a16z",
    "axios.com": "Axios",
    "thenextweb.com": "TNW",
    "techcrunch.com": "TechCrunch",
    "venturebeat.com": "VentureBeat",
    "theverge.com": "The Verge",
    "arstechnica.com": "Ars Technica",
    "openai.com": "OpenAI",
    "wabetainfo.com": "WABetaInfo",
    "9to5mac.com": "9to5Mac",
    "9to5google.com": "9to5Google",
    "socialmediatoday.com": "Social Media Today",
    "mattnavarra.substack.com": "Matt Navarra",
    "krebsonsecurity.com": "Krebs on Security",
    "feedburner.com": "The Hacker News",
    "bleepingcomputer.com": "BleepingComputer",
    "darkreading.com": "Dark Reading",
    "nasaspaceflight.com": "NASASpaceFlight",
    "spacenews.com": "SpaceNews",
    "space.com": "Space.com",
    "earthsky.org": "EarthSky",
    "platformer.news": "Platformer",
    "semafor.com": "Semafor",
    "ben-evans.com": "Ben Evans",
    "producthunt.com": "Product Hunt",
  };
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (overrides[host]) return overrides[host];
    const parts = host.split(".");
    parts.pop();
    return parts.join(" ").replace(/-/g, " ");
  } catch {
    return url;
  }
}

async function fetchFeed(
  feedUrl: string,
  category: Category,
  sourceName: string
): Promise<NewsItem[]> {
  try {
    const res = await fetch(feedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TechNewsDashboard/1.0)",
        "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
      },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 900 },
    });

    if (!res.ok) return [];

    const xml = await res.text();
    return parseRSS(xml, feedUrl, category, sourceName).slice(0, 5);
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("category") as Category | null;

  const categoriesToFetch = categoryId
    ? CATEGORIES.filter((c) => c.id === categoryId)
    : CATEGORIES;

  const allItems: NewsItem[] = [];

  const results = await Promise.allSettled(
    categoriesToFetch.flatMap((cat) =>
      cat.feeds.map((feedUrl) =>
        fetchFeed(feedUrl, cat.id, sourceNameFromUrl(feedUrl))
      )
    )
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      allItems.push(...result.value);
    }
  }

  // Sort newest first
  allItems.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  return NextResponse.json(allItems, {
    headers: { "Cache-Control": "s-maxage=900, stale-while-revalidate=60" },
  });
}
