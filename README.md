# PulseBoard

PulseBoard is a premium, real-time market intelligence dashboard designed for crypto operators. It tracks live token pricing, visualizes historical price trends, and manages global asset watchlists.

---

## 🚀 Page Rendering Strategies & Architecture

PulseBoard utilizes a hybrid next-generation rendering strategy to balance performance, caching, and fresh data:

### 1. Home / Marketing Landing Page (`/`) - **Static Site Generation (SSG)**
- **Behavior**: Pre-rendered into static HTML at build time for instant page loading times and perfect SEO indexability.
- **Visuals**: A bold, modern SaaS marketing site styled with responsive grids, interactive links, and custom SVG icons.

### 2. Live Market Dashboard (`/dashboard`) - **Server-Side Rendering (SSR)**
- **Behavior**: Rendered dynamically on the server on **every request** (`export const dynamic = "force-dynamic"`), bypassing static generation to ensure developers see fresh tick-by-tick prices.
- **Visuals**: Real-time ticker cards showcasing live prices, 24h percentage movements, and market caps, paired with a custom Recharts Price History chart.
- **Sub-system**: Implements a client-side polling interval that updates values and readouts every 15 seconds.

### 3. Sentiment Leaderboard (`/watchlist`) - **Incremental Static Regeneration (ISR)**
- **Behavior**: Statically built at compile time but configured to revalidate and refresh in the background every **60 seconds** (`export const revalidate = 60`).
- **Visuals**: Displays rank orders and popularity indicators for tracked tokens, drawing from Supabase aggregation queries.
- **Features**: Embeds a client-side registration form where users insert custom watch selections directly into Supabase.

### 4. API Endpoints - **Serverless Dynamic Handlers**
- `/api/prices`: GET route handler that fetches live prices from CoinGecko. Implements a **10-second in-memory server cache** to prevent IP-based rate limiting.
- `/api/history/[coinId]`: GET route handler fetching 7-day historical prices from CoinGecko. Implements a **5-minute in-memory server cache** map to cache historical close prices.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 / 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Database / Auth**: Supabase
- **Charts**: Recharts
- **Icons**: Lucide React
- **Language**: TypeScript (ESM format)

---

## 📂 Folder Structure

```text
├── app/                  # App Router pages, route handlers, and global styles
│   ├── api/              # API dynamic route handlers
│   ├── dashboard/        # SSR Dashboard (page, loading layout, and error boundary)
│   ├── watchlist/        # ISR Watchlist (leaderboard page)
│   ├── globals.css       # Tailwind entry and custom @theme tokens
│   └── layout.tsx        # SEO config, OG tags, and Font loading
├── components/           # Reusable Client & Server components (Navbar, PriceChart, WatchlistForm)
├── lib/                  # Initialization helpers (supabase client, price utilities)
├── supabase/             # SQL schema files for database setup
├── tailwind.config.ts    # Design token system (extended theme values)
├── next.config.ts        # Next.js configurations (image optimization, compiler options)
└── .env.local.example    # Environment configurations template
```

---

## ⚙️ Installation & Local Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or later)
- An active [Supabase](https://supabase.com/) project

### 2. Environment Configurations
Clone the environment template and name it `.env.local`:
```bash
cp .env.local.example .env.local
```
Fill in your public Supabase URL and anon API key:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-api-key
```

### 3. Database Schema Setup
1. Copy the contents of `supabase/schema.sql`.
2. Open the **SQL Editor** inside your Supabase project dashboard.
3. Paste the queries and click **Run**.
   *This will create the `watchlist` table, performance indices, aggregated sentiment view (`most_watched_coins`), and configure Row Level Security (RLS).*

### 4. Install Dependencies
```bash
npm install
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view PulseBoard.

### 6. Build Production Bundle
To compile TypeScript typings and build the production bundle:
```bash
npm run build
```
