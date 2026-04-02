import type { CategoryConfig } from "./types";

export const CATEGORIES: CategoryConfig[] = [
  {
    id: "ai",
    label: "AI",
    labelHe: "בינה מלאכותית",
    color: "#a855f7",
    bgColor: "rgba(168,85,247,0.08)",
    borderColor: "rgba(168,85,247,0.3)",
    badgeColor: "rgba(109,40,217,0.9)",
    feeds: [
      "https://techcrunch.com/category/artificial-intelligence/feed",
      "https://venturebeat.com/category/ai/feed",
      "https://www.theverge.com/rss/index.xml",
      "https://feeds.arstechnica.com/arstechnica/index",
      // OpenAI uses a different feed path; blog.google covers Google AI
      "https://openai.com/news/rss/",
      "https://blog.google/technology/ai/rss/",
    ],
  },
  {
    id: "social",
    label: "Social",
    labelHe: "רשתות חברתיות",
    color: "#3b82f6",
    bgColor: "rgba(59,130,246,0.08)",
    borderColor: "rgba(59,130,246,0.3)",
    badgeColor: "rgba(29,78,216,0.9)",
    feeds: [
      "https://wabetainfo.com/feed",
      "https://9to5mac.com/feed",
      "https://9to5google.com/feed",
      "https://www.socialmediatoday.com/rss",
      "https://mattnavarra.substack.com/feed",
    ],
  },
  {
    id: "security",
    label: "Security",
    labelHe: "אבטחת מידע",
    color: "#ef4444",
    bgColor: "rgba(239,68,68,0.08)",
    borderColor: "rgba(239,68,68,0.3)",
    badgeColor: "rgba(185,28,28,0.9)",
    feeds: [
      "https://krebsonsecurity.com/feed",
      "https://feeds.feedburner.com/TheHackersNews",
      "https://www.bleepingcomputer.com/feed",
      "https://www.darkreading.com/rss.xml",
    ],
  },
  {
    id: "space",
    label: "Space",
    labelHe: "חלל",
    color: "#14b8a6",
    bgColor: "rgba(20,184,166,0.08)",
    borderColor: "rgba(20,184,166,0.3)",
    badgeColor: "rgba(15,118,110,0.9)",
    feeds: [
      "https://www.nasaspaceflight.com/feed",
      "https://spacenews.com/feed",
      "https://www.space.com/feeds/all",
      "https://earthsky.org/feed",
    ],
  },
  {
    id: "siliconvalley",
    label: "Silicon Valley",
    labelHe: "עמק הסיליקון",
    color: "#f59e0b",
    bgColor: "rgba(245,158,11,0.08)",
    borderColor: "rgba(245,158,11,0.3)",
    badgeColor: "rgba(180,83,9,0.9)",
    feeds: [
      "https://www.platformer.news/feed",
      "https://www.semafor.com/feed",
      "https://newsletter.ben-evans.com/feed",
      // Stratechery is paywalled — replaced with a16z and Axios
      "https://a16z.com/feed/",
      "https://www.axios.com/feeds/feed.rss",
    ],
  },
  {
    id: "radar",
    label: "Under the Radar",
    labelHe: "מתחת לרדאר",
    color: "#ec4899",
    bgColor: "rgba(236,72,153,0.08)",
    borderColor: "rgba(236,72,153,0.3)",
    badgeColor: "rgba(190,24,93,0.9)",
    feeds: [
      "https://www.producthunt.com/feed",
      // Reddit blocks rss2json — replaced with Hacker News and Lobsters
      "https://hnrss.org/frontpage",
      "https://lobste.rs/rss",
      "https://thenextweb.com/feed",
    ],
  },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<string, CategoryConfig>;
