# PulseBoard

PulseBoard is a modern, real-time analytics dashboard built with Next.js 14 (App Router), TypeScript, and Tailwind CSS. It is connected to Supabase for backend database and auth services, and uses Recharts for data visualization.

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Database / Auth:** [Supabase](https://supabase.com/)
- **Charts:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

---

## Design System

We configure custom theme properties for PulseBoard's visual identity:

### Colors
- **Background:** `#FFFFFF` (Page background)
- **Surface:** `#F7F8FA` (Card & container background)
- **Primary:** `#4E5FFD` (Brand accent color)
- **Text Primary:** `#0A0A0F` (Main headings and body text)
- **Text Secondary:** `#6B7280` (Muted labels and helper text)
- **Success:** `#16A34A` (Positive trends, green alerts)
- **Danger:** `#DC2626` (Negative trends, red alerts)
- **Border:** `#E5E7EB` (Dividers, borders)

### Typography & Spacing
- **Font:** Google Fonts **Inter** (Weights: `400`, `500`, `600`, `700`) loaded via `next/font` as the default sans-serif font.
- **Border Radius:**
  - `card`: `16px` (For UI panels and cards)
  - `pill`: `9999px` (For badges, pills, buttons)

---

## Folder Structure

```text
├── app/                  # App Router pages & styles
│   ├── api/              # API Route Handlers
│   ├── globals.css       # Tailwind entry and CSS theme tokens
│   ├── layout.tsx        # HTML structure & Font initialization
│   └── page.tsx          # Landing / Main dashboard page
├── components/           # Reusable UI React components
├── lib/                  # Shared utilities (e.g. Supabase clients)
├── types/                # Shared TypeScript types & declarations
├── tailwind.config.ts    # Tailwind theme extensions
├── .env.local.example    # Environment variables blueprint
└── tsconfig.json         # TypeScript configuration
```

---

## Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18.x or later recommended) and an active Supabase project.

### 2. Environment Setup
Clone the `.env.local.example` file to `.env.local` and fill in your Supabase credentials:
```bash
cp .env.local.example .env.local
```

Open `.env.local` and set:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.
