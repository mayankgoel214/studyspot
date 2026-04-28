# StudySpot

A production-grade web app that helps Virginia Tech students find a place to study on campus. Live, **crowdsourced occupancy** for every spot — students tap "Open / Filling / Full" the same way Waze handles traffic, and a three-tap booking flow reserves group rooms.

Built for **CS 3724 — Intro to Human-Computer Interaction**, Spring 2026, by **Team User First (Group 8)**.

## Stack

- **Next.js 16** App Router, TypeScript strict, Server Components default, Server Actions
- **Tailwind 4** CSS-first config; DM Sans + Instrument Serif from Google Fonts
- **Supabase**: Postgres + Auth (magic link) + Realtime; RLS on every table
- **PWA**: manifest + service worker; installable to phone home screen, opens fullscreen

## Schema

| Table | Purpose |
|---|---|
| `profiles` | One row per `auth.users` row (auto-created via trigger) |
| `spots` | Study spaces (admin-seeded, read-only public) |
| `rooms` | Group rooms within spots |
| `reports` | Crowdsourced occupancy reports (read all, insert own) |
| `bookings` | Room reservations (RLS scoped to owner) |
| `saved_spots` | Per-user favorites |

A spot's occupancy is **derived live** from a recency-weighted average of reports in the last 45 minutes. No hardcoded percentages.

## Routes

| Path | Purpose |
|---|---|
| `/sign-in` | Magic-link sign-in / sign-up |
| `/onboarding` | Complete profile (display name, year, major) on first sign-in |
| `/app` | Map + list view (home) |
| `/app/spot/[id]` | Spot detail with report card + recent reports |
| `/app/spot/[id]/book` | 3-tap booking flow |
| `/app/spot/[id]/booked` | Confirmation |
| `/app/bookings` | Upcoming + past |
| `/app/saved` | Saved spots grid |
| `/app/profile` | Stats + settings |

## Local development

```bash
pnpm install
cp .env.local.example .env.local  # fill in Supabase URL + key
pnpm dev
```

## Deployment

Deployed to Vercel. Environment variables required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
