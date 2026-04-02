export type Category =
  | "ai"
  | "social"
  | "security"
  | "space"
  | "siliconvalley"
  | "radar";

export interface CategoryConfig {
  id: Category;
  label: string;
  labelHe: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeColor: string;
  feeds: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  titleHe?: string;
  summary: string;
  link: string;
  pubDate: string;
  source: string;
  category: Category;
  trendScore?: number; // how many sources covered this story
  thumbnail?: string;
}

export interface WrittenArticle {
  headline: string;
  subhead: string;
  bullets: string[];
  body: string;
}

export interface SavedArticle {
  id: string;
  headline: string;
  subhead: string;
  bullets: string[];
  body: string;
  sourceTitle: string;
  sourceLink: string;
  category: Category;
  savedAt: string;
}

export interface RSS2JSONResponse {
  status: string;
  feed: {
    url: string;
    title: string;
    link: string;
    author: string;
    description: string;
    image: string;
  };
  items: RSS2JSONItem[];
}

export interface RSS2JSONItem {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  enclosure: {
    link?: string;
    type?: string;
    length?: number;
    thumbnail?: string;
  };
  categories: string[];
}
