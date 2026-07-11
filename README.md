# Expenify

An AI-powered personal expense tracker — log income and spending, browse category-wise reports, and get AI-generated financial insights on your habits.

## Features

- **Dashboard** — overview of income, expenses, and recent transactions
- **Add/Edit transactions** — categorized income and expense entries
- **Reports** — category-wise spending breakdown
- **AI Insights** — Gemini-generated summary of your spending vs income, top spending category, and a practical money-saving tip
- **Settings** — account management
- **Authentication** via Clerk (sign-in/sign-up)

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + [TypeScript](https://www.typescriptlang.org)
- [Prisma](https://www.prisma.io) + PostgreSQL (tested with [Neon](https://neon.tech))
- [Clerk](https://clerk.com) — authentication
- [Google Gemini](https://ai.google.dev) (`@google/generative-ai`) — AI-generated financial insights
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (Radix primitives)

## Getting started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd expenify
npm install
```

### 2. Set up a Postgres database

Create a free database at [neon.tech](https://neon.tech) or [supabase.com](https://supabase.com), and copy its connection string.

### 3. Set up Clerk authentication

1. Create an application at [clerk.com](https://clerk.com)
2. Copy your **Publishable key** and **Secret key** from the Clerk dashboard

### 4. Get a Gemini API key

Free, no card required: [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

### 5. Environment variables

```bash
cp .env.example .env
```

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Your Neon/Supabase Postgres connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk dashboard → API Keys |
| `CLERK_SECRET_KEY` | Clerk dashboard → API Keys |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Defaults provided — leave as-is unless you change the routes |
| `GEMINI_API_KEY` | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |

### 6. Push the database schema

```bash
npx prisma generate
npx prisma db push
```

Optionally seed sample data:

```bash
npx tsx prisma/seed.ts
```

### 7. Run it

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Deployment

Deploys to **Vercel**:

1. Import the repo at [vercel.com/new](https://vercel.com/new) — auto-detected as Next.js
2. Add all env vars from `.env` under **Project Settings → Environment Variables**
3. In Clerk's dashboard, add your production domain under the Clerk instance's allowed origins/domains
4. Deploy

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run a production build locally |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── app/
│   ├── (dashboard)/       # Auth-gated pages: dashboard, add, edit, report, insights, settings
│   ├── sign-in/, sign-up/  # Clerk auth pages
├── components/             # UI components
├── lib/                    # Prisma client, Gemini AI helper, server actions
prisma/
└── schema.prisma            # User, Category, Expense models
```

## Author

**Vyom Desai**

[LinkedIn](https://www.linkedin.com/in/vyom-desai-01a34637a/?skipRedirect=true)
