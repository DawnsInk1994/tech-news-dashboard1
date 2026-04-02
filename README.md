# מרכז חדשות טק

A production-ready Hebrew tech news dashboard for journalists — aggregates RSS feeds across 6 categories, auto-refreshes every 15 minutes, and uses Claude to write polished Hebrew news articles in one click.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/tech-news-dashboard&env=ANTHROPIC_API_KEY&envDescription=Your%20Anthropic%20API%20key&envLink=https://console.anthropic.com/)

---

## Features

- **RSS Aggregator** — Fetches 5 articles per feed across 6 categories (AI, Social, Security, Space, Silicon Valley, Under the Radar), sorted newest-first
- **RTL Hebrew UI** — Fully right-to-left, dark-mode editorial design
- **AI Article Writer** — Click "כתוב ידיעה" on any card to generate a structured Hebrew news article (headline, subhead, bullets, body) using Claude Opus 4.6
- **Saved Articles Panel** — Save, copy, and manage written articles via `localStorage`
- **Auto-refresh** — Feeds refresh every 15 minutes; manual refresh button in top bar
- **Mobile responsive** — 1-column cards on mobile, 2-column on desktop, horizontal-scroll category pills

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** — dark editorial design system
- **Anthropic SDK** — Claude Opus 4.6 with adaptive thinking
- **rss2json.com** — CORS proxy for client-side RSS fetching
- **localStorage** — zero-database article persistence

---

## Setup

### 1. Install dependencies

```bash
cd tech-news-dashboard
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

Get your API key at [console.anthropic.com](https://console.anthropic.com/).

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

### One-click deploy

Click the **Deploy with Vercel** button at the top of this README and set the `ANTHROPIC_API_KEY` environment variable when prompted.

### Manual deploy

```bash
npm install -g vercel
vercel
```

Set the environment variable in Vercel Dashboard → Project → Settings → Environment Variables:

| Name | Value |
|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-...` |

---

## Project Structure

```
tech-news-dashboard/
├── app/
│   ├── layout.tsx           # Root HTML with RTL lang="he"
│   ├── page.tsx             # Main page — wires all components
│   ├── globals.css          # Tailwind + custom dark theme tokens
│   └── api/
│       └── write-article/
│           └── route.ts     # Claude API proxy (keeps key server-side)
├── components/
│   ├── TopBar.tsx           # Header with refresh + saved toggle
│   ├── CategoryFilter.tsx   # Horizontal pill filter bar
│   ├── NewsCard.tsx         # Card with inline article writer
│   ├── NewsGrid.tsx         # 2-col responsive grid
│   ├── SavedArticles.tsx    # Sidebar/panel for saved articles
│   └── LoadingSkeleton.tsx  # Shimmer skeleton cards
├── hooks/
│   └── useNewsFeeds.ts      # Fetch + auto-refresh logic
└── lib/
    ├── types.ts             # All TypeScript interfaces
    ├── categories.ts        # Feed URLs + category color configs
    ├── rss.ts               # RSS fetching via rss2json.com
    └── storage.ts           # localStorage CRUD for saved articles
```

---

## RSS Feeds by Category

| Category | Hebrew | Feeds |
|---|---|---|
| AI | בינה מלאכותית | TechCrunch AI, VentureBeat AI, The Verge, Ars Technica, OpenAI Blog, Anthropic |
| Social | רשתות חברתיות | WABetaInfo, 9to5Mac, 9to5Google, Social Media Today, Matt Navarra |
| Security | אבטחת מידע | Krebs on Security, The Hacker News, BleepingComputer, Dark Reading |
| Space | חלל | NASASpaceFlight, SpaceNews, Space.com, EarthSky |
| Silicon Valley | עמק הסיליקון | Platformer, Semafor, Ben Evans, Stratechery |
| Under the Radar | מתחת לרדאר | Product Hunt, r/artificial, r/netsec, r/technology |

---

## Notes

- The `/api/write-article` route proxies the Anthropic call server-side so your API key is never exposed to the browser.
- RSS fetching is done client-side via rss2json.com (free public CORS proxy). For production use, consider adding your own rss2json API key in `lib/rss.ts`.
- The free rss2json tier rate-limits aggressively; to avoid 429s in production, add a paid API key or self-host a CORS proxy.
