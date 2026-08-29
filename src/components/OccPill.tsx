import { occClass, occLabel } from "@/lib/domain";

const STYLES = {
  open: { background: "var(--color-open-50)", color: "#3a5d39" },
  fill: { background: "var(--color-fill-50)", color: "#7a5510" },
  full: { background: "var(--color-full-50)", color: "#803128" },
  // Deliberately grey and deliberately not a percentage. A spot nobody has
  // reported on looks like an absence of information, because that is what it
  // is.
  unknown: { background: "var(--color-cream-100, #f2ece0)", color: "#8a7f6d" },
};

export function OccPill({ pct, mode = "label" }: { pct: number | null; mode?: "label" | "pct" }) {
  const c = occClass(pct);
  const text = pct === null ? "No reports" : mode === "pct" ? `${pct}%` : occLabel(pct);
  return (
    <span
      className="rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-tight inline-flex flex-none"
      style={STYLES[c]}
    >
      {text}
    </span>
  );
}

export function StatusPill({ status }: { status: "open" | "fill" | "full" }) {
  return (
    <span
      className="rounded-full px-2.5 py-[3px] text-[10px] font-semibold uppercase tracking-wide flex-none"
      style={STYLES[status]}
    >
      {status === "open" ? "Open" : status === "fill" ? "Filling" : "Full"}
    </span>
  );
}
