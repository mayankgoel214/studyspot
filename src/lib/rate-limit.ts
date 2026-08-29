/**
 * Spend and abuse limits for the writes a signed-out visitor can make.
 *
 * Occupancy reports do not require an account, which is what makes the live
 * picture worth having — but it also means the only thing standing between the
 * table and a script is this. The ceiling is per-visitor and generous enough
 * that a real person reporting on several spots never meets it.
 *
 * State is in memory, so it resets on cold start and is per-instance. That is a
 * real weakness, and the honest reason it is acceptable here is the blast
 * radius: the worst outcome is noise in a crowdsourced occupancy figure that
 * decays out of the window in 45 minutes, not a bill or a data leak. If this
 * ever guards something that costs money, it needs a shared store.
 */

const WINDOW_MS = 60 * 60 * 1000;
const REPORTS_PER_VISITOR_PER_HOUR = 20;

interface Bucket {
  count: number;
  windowStartedAt: number;
}

const visitors = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds?: number;
}

function evictExpired(now: number): void {
  for (const [key, bucket] of visitors) {
    if (now - bucket.windowStartedAt > WINDOW_MS) visitors.delete(key);
  }
}

export function checkReportLimit(visitorKey: string): RateLimitResult {
  const now = Date.now();
  evictExpired(now);

  const bucket = visitors.get(visitorKey);
  if (!bucket || now - bucket.windowStartedAt > WINDOW_MS) {
    visitors.set(visitorKey, { count: 1, windowStartedAt: now });
    return { allowed: true, remaining: REPORTS_PER_VISITOR_PER_HOUR - 1 };
  }

  if (bucket.count >= REPORTS_PER_VISITOR_PER_HOUR) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((bucket.windowStartedAt + WINDOW_MS - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true, remaining: REPORTS_PER_VISITOR_PER_HOUR - bucket.count };
}

/**
 * Identifies a caller for rate limiting.
 *
 * Behind Vercel the client address arrives in x-forwarded-for, whose first
 * entry is the original client; later entries are proxies and are trivially
 * spoofable, so only the first is used.
 */
export function visitorKeyFrom(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "unknown";
}

/** Test seam. Not reachable from any route. */
export function __resetRateLimitsForTests(): void {
  visitors.clear();
}
