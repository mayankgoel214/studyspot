import { createClient } from "@/lib/supabase/server";
import {
  computeOccupancy,
  type ProfileRow,
  type ReportRow,
  type ReportStatus,
  type ReportWithProfile,
  type RoomRow,
  type SpotAmenities,
  type SpotComputed,
  type SpotRow,
  REPORT_WINDOW_MIN,
} from "@/lib/domain";

const RECENT_WINDOW_HOURS = 1;

type RawSpot = {
  id: string;
  name: string;
  type: string;
  initial: string;
  walk_min: number;
  hours: string;
  open_now: boolean;
  description: string;
  amenities: unknown;
  pos: unknown;
  has_group_rooms: boolean;
};

function castSpot(raw: RawSpot): SpotRow {
  return {
    ...raw,
    amenities: raw.amenities as SpotAmenities,
    pos: raw.pos as { x: number; y: number },
  };
}

/** All spots, with occupancy computed from recent reports. */
export async function getSpotsComputed(): Promise<SpotComputed[]> {
  const supabase = await createClient();
  const cutoff = new Date(Date.now() - RECENT_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
  const [{ data: spots }, { data: reports }] = await Promise.all([
    supabase.from("spots").select("*").order("walk_min", { ascending: true }),
    supabase
      .from("reports")
      .select("id, spot_id, user_id, status, created_at, profile:profiles(*)")
      .gte("created_at", cutoff)
      .order("created_at", { ascending: false }),
  ]);
  if (!spots) return [];
  const reportsBySpot = new Map<string, ReportWithProfile[]>();
  for (const r of (reports ?? []) as unknown as ReportWithProfile[]) {
    const arr = reportsBySpot.get(r.spot_id) ?? [];
    arr.push(r);
    reportsBySpot.set(r.spot_id, arr);
  }
  return spots.map((s) => {
    const all = reportsBySpot.get(s.id) ?? [];
    const { occPct, recent } = computeOccupancy(all);
    return {
      ...castSpot(s as RawSpot),
      occPct,
      reportCount: recent.length,
      lastReport: all[0] ?? null,
      recentReports: all.slice(0, 5),
    } as SpotComputed;
  });
}

export async function getSpotComputed(id: string): Promise<{
  spot: SpotComputed;
  rooms: RoomRow[];
} | null> {
  const supabase = await createClient();
  const cutoff = new Date(Date.now() - RECENT_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
  const [{ data: spot }, { data: rooms }, { data: reports }] = await Promise.all([
    supabase.from("spots").select("*").eq("id", id).maybeSingle(),
    supabase.from("rooms").select("*").eq("spot_id", id).order("name"),
    supabase
      .from("reports")
      .select("id, spot_id, user_id, status, created_at, profile:profiles(*)")
      .eq("spot_id", id)
      .gte("created_at", cutoff)
      .order("created_at", { ascending: false }),
  ]);
  if (!spot) return null;
  const all = (reports ?? []) as unknown as ReportWithProfile[];
  const { occPct, recent } = computeOccupancy(all);
  return {
    spot: {
      ...castSpot(spot as RawSpot),
      occPct,
      reportCount: recent.length,
      lastReport: all[0] ?? null,
      recentReports: all.slice(0, 6),
    },
    rooms: (rooms ?? []) as RoomRow[],
  };
}

/** Counts of unique users who reported in the last hour (for greeting). */
export async function getActiveReporterCount(): Promise<number> {
  const supabase = await createClient();
  const cutoff = new Date(Date.now() - RECENT_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
  const { data } = await supabase
    .from("reports")
    .select("user_id")
    .gte("created_at", cutoff);
  if (!data) return 0;
  return new Set(data.map((r) => r.user_id)).size;
}

export async function getMyProfile(): Promise<ProfileRow | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return (data ?? null) as ProfileRow | null;
}

export async function getMyReportCount(): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("reports")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", cutoff);
  return count ?? 0;
}

export type BookingWithSpot = {
  id: string;
  starts_at: string;
  duration_min: number;
  status: "upcoming" | "past" | "cancelled";
  spot: { id: string; name: string; initial: string; walk_min: number };
  room: { id: string; name: string; floor: string; capacity: number };
};

export async function getMyBookings(): Promise<BookingWithSpot[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("bookings")
    .select(
      `id, starts_at, duration_min, status,
       spot:spots!inner(id, name, initial, walk_min),
       room:rooms!inner(id, name, floor, capacity)`,
    )
    .eq("user_id", user.id)
    .order("starts_at", { ascending: false });
  return (data ?? []) as unknown as BookingWithSpot[];
}

export async function getMySavedSpots(): Promise<SpotComputed[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const cutoff = new Date(Date.now() - RECENT_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
  const { data: rows } = await supabase
    .from("saved_spots")
    .select("spot:spots!inner(*)")
    .eq("user_id", user.id);
  const spots = ((rows ?? []) as unknown as { spot: RawSpot }[]).map((r) => r.spot);
  if (spots.length === 0) return [];
  const { data: reports } = await supabase
    .from("reports")
    .select("id, spot_id, user_id, status, created_at, profile:profiles(*)")
    .in(
      "spot_id",
      spots.map((s) => s.id),
    )
    .gte("created_at", cutoff)
    .order("created_at", { ascending: false });
  const byId = new Map<string, ReportWithProfile[]>();
  for (const r of (reports ?? []) as unknown as ReportWithProfile[]) {
    const arr = byId.get(r.spot_id) ?? [];
    arr.push(r);
    byId.set(r.spot_id, arr);
  }
  return spots.map((s) => {
    const all = byId.get(s.id) ?? [];
    const { occPct, recent } = computeOccupancy(all);
    return {
      ...castSpot(s),
      occPct,
      reportCount: recent.length,
      lastReport: all[0] ?? null,
      recentReports: all.slice(0, 5),
    } as SpotComputed;
  });
}

export async function getMySavedSpotIds(): Promise<Set<string>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Set();
  const { data } = await supabase.from("saved_spots").select("spot_id").eq("user_id", user.id);
  return new Set((data ?? []).map((r) => r.spot_id));
}

export type { ReportRow, ReportStatus };
