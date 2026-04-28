/* Domain helpers shared across the app — no React, no Supabase. */

export type ReportStatus = "open" | "fill" | "full";

export type SpotAmenities = {
  quiet: boolean;
  outlets: boolean;
  wifi: boolean;
  group: boolean;
};

export type Pos = { x: number; y: number };

export type SpotRow = {
  id: string;
  name: string;
  type: string;
  initial: string;
  walk_min: number;
  hours: string;
  open_now: boolean;
  description: string;
  amenities: SpotAmenities;
  pos: Pos;
  has_group_rooms: boolean;
};

export type RoomRow = {
  id: string;
  spot_id: string;
  name: string;
  capacity: number;
  floor: string;
};

export type ReportRow = {
  id: string;
  spot_id: string;
  user_id: string;
  status: ReportStatus;
  created_at: string;
};

export type ProfileRow = {
  id: string;
  display_name: string;
  year: string | null;
  major: string | null;
  avatar_color: string;
};

export type ReportWithProfile = ReportRow & { profile: ProfileRow | null };

export type SpotComputed = SpotRow & {
  occPct: number;
  reportCount: number;
  lastReport: ReportWithProfile | null;
  recentReports: ReportWithProfile[];
};

const STATUS_SCORE: Record<ReportStatus, number> = { open: 18, fill: 55, full: 88 };
export const REPORT_WINDOW_MIN = 45;

/**
 * Recency-weighted average of recent reports.
 * Reports older than REPORT_WINDOW_MIN are dropped.
 */
export function computeOccupancy(reports: ReportRow[], now: Date = new Date()): {
  occPct: number;
  recent: ReportRow[];
} {
  const recent = reports.filter((r) => minsBetween(r.created_at, now) < REPORT_WINDOW_MIN);
  if (recent.length === 0) return { occPct: 30, recent };
  let totalW = 0;
  let totalScore = 0;
  for (const r of recent) {
    const mins = minsBetween(r.created_at, now);
    const w = Math.max(0.3, 1 - mins / REPORT_WINDOW_MIN);
    totalScore += STATUS_SCORE[r.status] * w;
    totalW += w;
  }
  return { occPct: Math.round(totalScore / totalW), recent };
}

export function minsBetween(iso: string, now: Date = new Date()): number {
  const t = new Date(iso).getTime();
  return Math.max(0, (now.getTime() - t) / 60_000);
}

export function relTime(iso: string, now: Date = new Date()): string {
  const m = minsBetween(iso, now);
  if (m < 1) return "just now";
  if (m < 60) return `${Math.round(m)} min ago`;
  if (m < 60 * 24) return `${Math.round(m / 60)}h ago`;
  return `${Math.round(m / 60 / 24)}d ago`;
}

export function occClass(p: number): "open" | "fill" | "full" {
  if (p < 40) return "open";
  if (p < 75) return "fill";
  return "full";
}

export function occLabel(p: number): string {
  if (p < 40) return "Open";
  if (p < 75) return "Filling up";
  return "Full";
}

export function statusLabel(s: ReportStatus): string {
  return s === "open" ? "Open" : s === "fill" ? "Filling" : "Full";
}

export type Filter = "all" | "quiet" | "outlets" | "wifi" | "open";
export const FILTER_LABELS: Record<Filter, string> = {
  all: "All",
  quiet: "Quiet",
  outlets: "Outlets",
  wifi: "WiFi",
  open: "Open Now",
};

export function spotPasses(spot: SpotComputed, filters: Set<Filter>): boolean {
  if (filters.size === 0) return true;
  for (const f of filters) {
    if (f === "all") continue;
    if (f === "quiet" && !spot.amenities.quiet) return false;
    if (f === "outlets" && !spot.amenities.outlets) return false;
    if (f === "wifi" && !spot.amenities.wifi) return false;
    if (f === "open" && (!spot.open_now || spot.occPct >= 95)) return false;
  }
  return true;
}

export const TIME_SLOTS: { t: string; available: boolean }[] = [
  { t: "1:00 PM", available: false },
  { t: "1:30 PM", available: false },
  { t: "2:00 PM", available: true },
  { t: "2:30 PM", available: true },
  { t: "3:00 PM", available: true },
  { t: "3:30 PM", available: true },
  { t: "4:00 PM", available: true },
  { t: "4:30 PM", available: true },
  { t: "5:00 PM", available: false },
  { t: "5:30 PM", available: true },
  { t: "6:00 PM", available: true },
  { t: "7:00 PM", available: true },
];

/** Convert a "3:00 PM" slot (today's date) to ISO timestamp. */
export function slotToISO(slot: string, baseDate: Date = new Date()): string {
  const m = slot.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) throw new Error(`Bad slot: ${slot}`);
  let h = parseInt(m[1]!, 10);
  const min = parseInt(m[2]!, 10);
  const pm = m[3]!.toUpperCase() === "PM";
  if (pm && h !== 12) h += 12;
  if (!pm && h === 12) h = 0;
  const d = new Date(baseDate);
  d.setHours(h, min, 0, 0);
  return d.toISOString();
}

export function formatHHMMAmPm(iso: string): string {
  const d = new Date(iso);
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  const mm = m.toString().padStart(2, "0");
  return `${h}:${mm} ${ampm}`;
}
