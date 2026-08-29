# Database

The schema lives here, in version control, because it did not used to.

The original Supabase project was built by clicking through the dashboard. When
it was deleted, the schema went with it: the deployed site kept serving a
sign-in page against a hostname that no longer resolved, and nothing in the
repository recorded what the database had contained. `0001_schema.sql` was
reconstructed from `src/lib/database.types.ts`, which is generated from the live
database and was the only surviving record of it.

## Rebuilding from nothing

Both files are idempotent, so running them twice is not a decision.

**Dashboard** — open the project, go to **SQL Editor**, paste
`migrations/0001_schema.sql`, run it, then paste `seed.sql` and run that.

**CLI** — with the database connection string from **Settings → Database**:

```bash
export SUPABASE_DB_URL='postgresql://postgres:...@db.<ref>.supabase.co:5432/postgres'
npm run db:push
```

Then point the app at the project by putting its URL and anon key in
`.env.local`, and set the same two values in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

The anon key is safe to expose — it is shipped in the client bundle by design,
and every table is protected by row-level security rather than by hiding it.

## Auth settings

Sign-in is a magic link, so the project's **Authentication → URL Configuration**
needs the deployed origin in **Site URL** and `<origin>/auth/callback` in
**Redirect URLs**, or the link in the email will bounce to localhost.

## What is seeded, and what is not

`seed.sql` inserts six real Virginia Tech buildings and the group rooms inside
them. It inserts **no reports**.

That is deliberate. Occupancy is crowdsourced and derived live from the last 45
minutes of reports; seeding it would mean inventing observations nobody made and
then displaying them as a current reading. A freshly seeded database therefore
shows "No recent reports" everywhere until a real person taps Open, Filling or
Full — which anybody can do, with or without an account.

## Row-level security

| Table | Anonymous | Signed in |
| --- | --- | --- |
| `spots`, `rooms` | read | read |
| `reports` | read, and insert with no author | read, insert as self |
| `profiles` | read | read, write own |
| `bookings`, `saved_spots` | none | own rows only |

`spots` and `rooms` have no write policy at all, so they are reachable only
through the service role — which is to say, through `seed.sql`.

`profiles` is publicly readable because a report is displayed next to the
display name and avatar colour of whoever filed it, and those reports are
public. The row holds a chosen display name, year and major; email and identity
live in `auth.users`, which is not exposed.
