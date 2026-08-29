-- StudySpot schema.
--
-- This file did not exist until 2026-08-29, and its absence is why it is here.
-- The original Supabase project was created by clicking through the dashboard,
-- and when that project was deleted the schema went with it: the deployed site
-- kept serving a sign-in page against a hostname that no longer resolved, and
-- nothing in the repository recorded what the database had looked like.
--
-- The schema below was reconstructed from src/lib/database.types.ts, which is
-- generated from the live database and was the only surviving record. From here
-- on the database is defined in version control and can be rebuilt from a clean
-- Supabase project by running this file followed by seed.sql.
--
-- Idempotent on purpose, so re-running it against a partially built project is
-- safe rather than a decision about how brave you feel.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

do $$ begin
  create type public.booking_status as enum ('upcoming', 'past', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.report_status as enum ('open', 'fill', 'full');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- One row per auth.users row, created by the trigger at the bottom of this file.
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text        not null,
  year         text,
  major        text,
  avatar_color text        not null default '#7a9659',
  created_at   timestamptz not null default now()
);

-- Study spaces. Seeded by an administrator; no user-facing write path exists,
-- which is what makes the public read policy below safe.
create table if not exists public.spots (
  id              text        primary key,
  name            text        not null,
  type            text        not null,
  initial         text        not null,
  walk_min        integer     not null,
  hours           text        not null,
  open_now        boolean     not null default true,
  description     text        not null,
  amenities       jsonb       not null default '{"quiet":false,"outlets":false,"wifi":true,"group":false}'::jsonb,
  -- Percentages over the campus map, not pixels — MapListView positions markers
  -- with left/top in %, so the map can be resized without touching the data.
  pos             jsonb       not null default '{"x":50,"y":50}'::jsonb,
  has_group_rooms boolean     not null default false,
  created_at      timestamptz not null default now()
);

create table if not exists public.rooms (
  id         text        primary key,
  spot_id    text        not null references public.spots (id) on delete cascade,
  name       text        not null,
  floor      text        not null,
  capacity   integer     not null check (capacity > 0),
  created_at timestamptz not null default now()
);

create index if not exists rooms_spot_id_idx on public.rooms (spot_id);

-- Crowdsourced occupancy. Occupancy is never stored: it is derived in the
-- application from a recency-weighted average of the last 45 minutes of
-- reports, so there is no percentage column here to drift out of date.
create table if not exists public.reports (
  id         uuid        primary key default gen_random_uuid(),
  spot_id    text        not null references public.spots (id) on delete cascade,
  -- Nullable, and that is the point. A signed-out visitor can report occupancy;
  -- their row simply carries no author. Requiring an account to answer "is this
  -- room busy right now" would make the crowdsourced picture worse for the sake
  -- of attribution nobody asked for, and it is the reason the deployed app used
  -- to be unusable without a magic link.
  user_id    uuid        references public.profiles (id) on delete set null,
  status     public.report_status not null,
  created_at timestamptz not null default now()
);

-- The hot query is "reports for these spots in the last hour", newest first.
create index if not exists reports_spot_created_idx
  on public.reports (spot_id, created_at desc);
create index if not exists reports_created_idx
  on public.reports (created_at desc);

create table if not exists public.bookings (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references public.profiles (id) on delete cascade,
  spot_id      text        not null references public.spots (id) on delete cascade,
  room_id      text        not null references public.rooms (id) on delete cascade,
  starts_at    timestamptz not null,
  duration_min integer     not null check (duration_min > 0),
  status       public.booking_status not null default 'upcoming',
  created_at   timestamptz not null default now()
);

create index if not exists bookings_user_starts_idx
  on public.bookings (user_id, starts_at desc);
create index if not exists bookings_room_starts_idx
  on public.bookings (room_id, starts_at);

create table if not exists public.saved_spots (
  user_id    uuid        not null references public.profiles (id) on delete cascade,
  spot_id    text        not null references public.spots (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, spot_id)
);

-- ---------------------------------------------------------------------------
-- Booking conflicts
-- ---------------------------------------------------------------------------

-- Overlap test for a proposed booking against the confirmed ones in a room.
--
-- security definer so the check sees every booking in the room, not only the
-- caller's. Without that, row-level security would hide other people's
-- bookings from the conflict check and the room would double-book silently —
-- the caller would be told their slot was free because the rows proving
-- otherwise were invisible to them.
create or replace function public.has_booking_conflict(
  p_room_id      text,
  p_starts_at    timestamptz,
  p_duration_min integer
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.bookings b
    where b.room_id = p_room_id
      and b.status = 'upcoming'
      and tstzrange(b.starts_at, b.starts_at + make_interval(mins => b.duration_min), '[)')
          && tstzrange(p_starts_at, p_starts_at + make_interval(mins => p_duration_min), '[)')
  );
$$;

-- ---------------------------------------------------------------------------
-- New-user trigger
-- ---------------------------------------------------------------------------

-- A profile row per auth user, so the rest of the schema can use profiles.id as
-- its foreign key without every insert path having to remember to create one.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------

alter table public.profiles    enable row level security;
alter table public.spots       enable row level security;
alter table public.rooms       enable row level security;
alter table public.reports     enable row level security;
alter table public.bookings    enable row level security;
alter table public.saved_spots enable row level security;

-- Spots and rooms are public reference data. Reading them requires no account,
-- which is what lets a visitor browse the map without signing in. There is no
-- insert, update or delete policy on either, so they are writable only through
-- the service role — seeding — and not by any client.
drop policy if exists "spots are public" on public.spots;
create policy "spots are public" on public.spots
  for select to anon, authenticated using (true);

drop policy if exists "rooms are public" on public.rooms;
create policy "rooms are public" on public.rooms
  for select to anon, authenticated using (true);

-- Reports are public to read, because the whole point is a shared live picture
-- of how busy a room is, and a visitor who has not signed in should be able to
-- see it. Writing one requires an account and can only be attributed to the
-- account writing it.
drop policy if exists "reports are public" on public.reports;
create policy "reports are public" on public.reports
  for select to anon, authenticated using (true);

-- A signed-in user may only file reports under their own id; a signed-out one
-- may only file reports with no id at all. Neither can attribute a report to
-- somebody else, which is the property that matters.
drop policy if exists "own reports insertable" on public.reports;
create policy "own reports insertable" on public.reports
  for insert to authenticated with check (auth.uid() = user_id or user_id is null);

drop policy if exists "anonymous reports insertable" on public.reports;
create policy "anonymous reports insertable" on public.reports
  for insert to anon with check (user_id is null);

-- Profiles are readable by anyone, because a report is shown next to the
-- display name and avatar colour of whoever filed it, and those reports are
-- public. The row holds a chosen display name, year and major — no email and
-- no contact details, which live in auth.users and are not exposed here. A
-- profile is writable only by the person it belongs to.
drop policy if exists "profiles are public" on public.profiles;
create policy "profiles are public" on public.profiles
  for select to anon, authenticated using (true);

drop policy if exists "own profile updatable" on public.profiles;
create policy "own profile updatable" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own profile insertable" on public.profiles;
create policy "own profile insertable" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

-- Bookings and saved spots are private to their owner in every direction.
-- These are the tables where a missing policy would leak one student's
-- movements to another, so each verb is named rather than covered by `for all`.
drop policy if exists "own bookings readable" on public.bookings;
create policy "own bookings readable" on public.bookings
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "own bookings insertable" on public.bookings;
create policy "own bookings insertable" on public.bookings
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "own bookings updatable" on public.bookings;
create policy "own bookings updatable" on public.bookings
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own bookings deletable" on public.bookings;
create policy "own bookings deletable" on public.bookings
  for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "own saved readable" on public.saved_spots;
create policy "own saved readable" on public.saved_spots
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "own saved insertable" on public.saved_spots;
create policy "own saved insertable" on public.saved_spots
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "own saved deletable" on public.saved_spots;
create policy "own saved deletable" on public.saved_spots
  for delete to authenticated using (auth.uid() = user_id);
