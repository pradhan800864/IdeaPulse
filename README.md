# IdeaPulse

IdeaPulse is a production-grade startup ideas aggregator dashboard. It collects, deduplicates, and analyzes startup ideas from Reddit, Hacker News, Product Hunt, and web sources.

## Features

- **Ingestion Engine**: Automatically fetches new ideas from configured sources.
- **Deduplication**: Uses SHA-256 hashing of normalized titles/urls to prevent duplicates.
- **Auto-Tagging**: Tags ideas based on keywords and (optional) OpenAI integration.
- **Dashboard**: Visualize trends, active sources, and recent activity.
- **Management**: Review, archive, and save ideas to collections.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Database**: PostgreSQL (Prisma)
- **Styling**: Tailwind CSS + Shadcn UI
- **Auth**: NextAuth.js
- **Jobs**: In-app cron + manual API triggers

## Getting Started

### 1. Setup Environment

Copy `.env.example` to `.env` and fill in your details:

```bash
cp .env.example .env
```

**Required:**
- `DATABASE_URL`: Connection string to your Postgres DB (Supabase Transaction Pooler recommended).
- `DIRECT_URL`: Direct connection string (Supabase Session Mode).
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`.

### 2. Install & Seed

```bash
npm install
npx prisma generate
npx prisma db push  # or prisma migrate dev
npx prisma db seed  # Creates admin/demo users
```

**Default Users:**
- Admin: `admin@example.com` / `admin123`
- Demo: `demo@example.com` / `demo123`

### 3. Run Development

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Deployment

The app is ready for Vercel. Ensure you set the Environment Variables in your Vercel project settings.

### cron jobs
The ingestion runs every 30 minutes if the server is running (Node runtime). For Vercel, you should call `/api/jobs/ingest` using Vercel Cron Config or an external cron service (e.g. GitHub Actions, cron-job.org) secured with `JOB_SECRET`.

## License

MIT
