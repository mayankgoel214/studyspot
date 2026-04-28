# StudySpot

A high-fidelity, installable interactive prototype of **StudySpot**, a mobile app that helps Virginia Tech students find a place to study on campus. Color-coded pins show **crowdsourced occupancy** — students like you tell each other how full each spot is, the same way Waze handles traffic. Filter chips narrow results by what you actually need (quiet, outlets, WiFi, open now), and a three-tap booking flow reserves group rooms.

Built for **CS 3724 — Intro to Human-Computer Interaction**, Spring 2026, by **Team User First (Group 8)**: Mayank Goel and Rohan Anand.

## Live prototype

→ Hosted via Vercel — see the deployed URL in the repo description.

It's also a **Progressive Web App**, so on a phone you can "Add to Home Screen" (Safari → Share → Add to Home Screen, or Android Chrome → ⋮ → Install app). After installing it opens fullscreen with no browser chrome — feels exactly like a native app.

## How the occupancy data works

There's no live data feed. Occupancy for every spot is computed from a `REPORTS` array — each report is `{ user, status, minsAgo }`, and a spot's percentage is a recency-weighted average of its recent reports (≤ 45 minutes old). When Priya (the current user) submits her own report from the spot detail screen, the data updates in real time and her contribution count goes up.

The prototype seeds ~22 reports from 8 fictional students so you have data to look at. In production, this would come from VT students opening the app and tapping "Open / Filling / Full" — same crowdsourced model as Google Maps' "Popular times" or Waze's traffic. No backend integrations needed; no privacy minefield.

## What the prototype covers

The four core screens from the Phase 2 design, plus the bottom-nav supporting screens:

1. **Map / List** — Drillfield-centered campus map with crowdsourced occupancy pins for Newman, Torgersen, McBryde, Goodwin, Squires, Surge, and the Drillfield Lawn. Each list row shows the most recent reporter ("Emma · 8 min ago"). Filter chips and the Map ↔ List toggle are both fully wired.
2. **Spot detail** — Occupancy ring, walk time, hours, amenities, save/share. A "How busy is it right now?" report card lets the user submit Open / Filling / Full. A "Recent reports" section shows the last reporters with avatars, year, major, and time. The "Book a group room" CTA enters the booking flow.
3. **Booking** — Three taps: pick room → pick time → confirm. Step indicator updates as you progress.
4. **Confirmation** — Animated success state, ticket-style summary, get directions / share with friends / back to map.
5. **Bookings tab** — Upcoming and past sessions. New bookings show up here immediately.
6. **Saved tab** — A grid of your saved spots with current occupancy.
7. **Profile tab** — Avatar, study stats (including your contribution count), and a "Live demo mode" toggle that drops in fake reports from other students every few seconds so you can watch occupancy shift in real time.

## The three evaluation questions this prototype lets you test

This was built around the three questions from our Phase 3 evaluation plan:

1. **Is the color-coded pin metaphor obvious?** — Green / amber / red pins with a visible legend on the map.
2. **Can someone book a group room in under 30 seconds?** — Three taps from the detail screen to the confirmation.
3. **Does the map ↔ list toggle help or add clutter?** — Both views are fully functional, sorted, and share the same data, so evaluators can compare.

## Running it

It's a single static HTML file with no build step. Open `index.html` directly in any browser, or serve the folder:

```bash
python3 -m http.server 4173
```

Then go to <http://localhost:4173>.

## Tech notes

- Single `index.html`, vanilla JS, no framework, no build step.
- Mock data only — there's no backend. State changes happen client-side.
- Designed mobile-first at 390px. Renders inside a phone frame on desktop.
- Fonts: DM Sans (body) + Instrument Serif (display) via Google Fonts.

## Phase context

| Phase | Focus | Status |
|---|---|---|
| 0 | Team formation | Done |
| 1 | Analysis &amp; requirements (CI, WAAD, flow model, design requirements) | Done |
| 2 | Design (wireframes, storyboards, UX goals/metrics/targets) | Done |
| 3 | **Prototype + analytic evaluation plan** | Current |
| 4 | Empirical evaluation with users | Upcoming |

## License

MIT — class project.
