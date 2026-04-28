"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Avatar } from "@/components/Avatar";
import { CampusMap } from "@/components/CampusMap";
import { OccPill } from "@/components/OccPill";
import {
  FILTER_LABELS,
  type Filter,
  type ProfileRow,
  type SpotComputed,
  occClass,
  relTime,
  spotPasses,
} from "@/lib/domain";
import { Icons } from "@/lib/icons";

const FILTER_ORDER: Filter[] = ["all", "quiet", "outlets", "wifi", "open"];

export function MapListView({
  profile,
  spots,
  reporterCount,
  initialFilters,
  initialView,
}: {
  profile: ProfileRow | null;
  spots: SpotComputed[];
  reporterCount: number;
  initialFilters: Filter[];
  initialView: "map" | "list";
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [filters, setFilters] = useState<Set<Filter>>(
    () => new Set(initialFilters.filter((f) => f !== "all")),
  );
  const [view, setView] = useState<"map" | "list">(initialView);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const ql = search.trim().toLowerCase();
    return spots.filter(
      (s) =>
        spotPasses(s, filters) &&
        (ql === "" ||
          s.name.toLowerCase().includes(ql) ||
          s.type.toLowerCase().includes(ql)),
    );
  }, [spots, filters, search]);

  const sortedList = useMemo(
    () => [...filtered].sort((a, b) => a.walk_min - b.walk_min),
    [filtered],
  );

  const selectedSpot = useMemo(
    () => spots.find((s) => s.id === selectedId) ?? null,
    [spots, selectedId],
  );

  function syncURL(nextFilters: Set<Filter>, nextView: "map" | "list") {
    const params = new URLSearchParams(sp);
    const list = [...nextFilters];
    if (list.length === 0) params.delete("filters");
    else params.set("filters", list.join(","));
    if (nextView === "list") params.set("view", "list");
    else params.delete("view");
    startTransition(() => {
      router.replace(`/app${params.toString() ? "?" + params.toString() : ""}`, {
        scroll: false,
      });
    });
  }

  function toggleFilter(f: Filter) {
    const next = new Set(filters);
    if (f === "all") {
      next.clear();
    } else if (next.has(f)) {
      next.delete(f);
    } else {
      next.add(f);
    }
    setFilters(next);
    syncURL(next, view);
  }

  function setMode(v: "map" | "list") {
    setView(v);
    syncURL(filters, v);
  }

  function onPinClick(id: string) {
    if (selectedId === id) {
      router.push(`/app/spot/${id}`);
    } else {
      setSelectedId(id);
    }
  }

  return (
    <div className="absolute inset-0 overflow-y-auto no-scrollbar pb-[110px]">
      {/* Header */}
      <div className="px-[22px] pt-[60px] pb-[14px]">
        <div
          className="text-[30px] leading-[1.1] tracking-tight text-bark-900"
          style={{ fontFamily: "var(--font-display)" }}
        >
          good afternoon,{" "}
          <em className="text-bark-700">
            {profile?.display_name?.split(" ")[0] ?? "friend"}.
          </em>
        </div>
        <div className="text-[13px] text-muted-fg tracking-tight mt-1">
          <b className="text-bark-800">{spots.length} spots</b>
          {" · "}
          <b className="text-bark-800">{reporterCount}</b> students reporting in the last hour
        </div>

        <div className="mt-4 flex items-center bg-white border border-line rounded-2xl px-3.5 py-3 shadow-sm">
          <Icons.Search width={18} height={18} className="text-bark-600" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search buildings, rooms, or amenities…"
            className="ml-2.5 flex-1 outline-none text-[15px] text-ink bg-transparent placeholder:text-bark-500"
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 px-[22px] pt-3.5 pb-1.5 overflow-x-auto no-scrollbar">
        {FILTER_ORDER.map((f) => {
          const active = (f === "all" && filters.size === 0) || filters.has(f);
          const Icon =
            f === "quiet"
              ? Icons.Quiet
              : f === "outlets"
                ? Icons.Outlets
                : f === "wifi"
                  ? Icons.Wifi
                  : f === "open"
                    ? Icons.Clock
                    : null;
          return (
            <button
              key={f}
              onClick={() => toggleFilter(f)}
              className={`flex-none inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-[13px] font-medium border transition-all whitespace-nowrap active:scale-[0.96] ${
                active
                  ? "bg-bark-900 text-cream-50 border-bark-900"
                  : "bg-white text-bark-800 border-line hover:border-bark-300"
              }`}
            >
              {Icon ? (
                <Icon width={14} height={14} />
              ) : (
                <span
                  className={`h-1.5 w-1.5 rounded-full ${active ? "bg-cream-100" : "bg-bark-700"}`}
                />
              )}
              {FILTER_LABELS[f]}
            </button>
          );
        })}
      </div>

      {/* Map view */}
      {view === "map" && (
        <div
          className="relative mx-[22px] mt-3 rounded-[28px] overflow-hidden"
          style={{
            height: 420,
            background: "linear-gradient(160deg, #ece2c3 0%, #d8caa0 100%)",
            boxShadow:
              "0 6px 18px -8px rgba(46, 28, 10, 0.18), 0 2px 4px rgba(46, 28, 10, 0.04), inset 0 0 0 1px rgba(255,255,255,0.4)",
          }}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("[data-pin]")) return;
            if ((e.target as HTMLElement).closest("[data-preview]")) return;
            if ((e.target as HTMLElement).closest("[data-toggle]")) return;
            if ((e.target as HTMLElement).closest("[data-legend]")) return;
            setSelectedId(null);
          }}
        >
          <CampusMap />

          {/* Pin overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {filtered.map((s) => (
              <Pin
                key={s.id}
                spot={s}
                selected={selectedId === s.id}
                onClick={() => onPinClick(s.id)}
              />
            ))}
          </div>

          {/* Legend */}
          <div
            data-legend
            className="absolute left-3.5 bottom-3.5 bg-white/[0.92] backdrop-blur-md rounded-xl px-3 py-2.5 flex gap-3 text-[11px] font-medium text-bark-800 border border-bark-900/[0.06] shadow-sm"
          >
            <span className="inline-flex items-center gap-1.5">
              <i className="h-2 w-2 rounded-full bg-open" /> Open
            </span>
            <span className="inline-flex items-center gap-1.5">
              <i className="h-2 w-2 rounded-full bg-fill" /> Filling Up
            </span>
            <span className="inline-flex items-center gap-1.5">
              <i className="h-2 w-2 rounded-full bg-full" /> Full
            </span>
          </div>

          {/* Map/List toggle */}
          <div
            data-toggle
            className="absolute right-3.5 top-3.5 bg-white/[0.96] backdrop-blur rounded-full p-1 flex shadow-sm border border-bark-900/[0.06]"
          >
            <button
              onClick={() => setMode("map")}
              className="px-3 py-1.5 rounded-full text-[12px] font-semibold text-cream-50 bg-bark-900"
            >
              Map
            </button>
            <button
              onClick={() => setMode("list")}
              className="px-3 py-1.5 rounded-full text-[12px] font-semibold text-bark-700"
            >
              List
            </button>
          </div>

          {/* Preview card */}
          {selectedSpot && (
            <Link
              href={`/app/spot/${selectedSpot.id}`}
              data-preview
              className="absolute left-3.5 right-3.5 bottom-3.5 bg-white rounded-[22px] p-3.5 border border-bark-900/[0.06] shadow-lg block"
              style={{ boxShadow: "0 24px 48px -20px rgba(46,28,10,0.30), 0 6px 12px rgba(46,28,10,0.06)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-14 w-14 rounded-2xl grid place-items-center text-bark-700 flex-none"
                  style={{
                    background: "linear-gradient(135deg, var(--color-cream-200), var(--color-cream-300))",
                    fontFamily: "var(--font-display)",
                    fontSize: 26,
                  }}
                >
                  {selectedSpot.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[16px] font-semibold text-bark-900 leading-tight tracking-tight">
                    {selectedSpot.name}
                  </div>
                  <div className="text-[12px] text-muted-fg mt-0.5 flex items-center gap-1.5">
                    {selectedSpot.walk_min} min walk
                    <i className="h-[3px] w-[3px] rounded-full bg-bark-300" />
                    {selectedSpot.occPct}% full
                    <i className="h-[3px] w-[3px] rounded-full bg-bark-300" />
                    {selectedSpot.reportCount} reports
                  </div>
                </div>
                <OccPill pct={selectedSpot.occPct} />
              </div>
              {selectedSpot.lastReport?.profile && (
                <div className="mt-2.5 pt-2.5 border-t border-dashed border-line flex items-center gap-1.5 text-[11px] text-muted-fg">
                  <Avatar
                    initial={selectedSpot.lastReport.profile.display_name[0]?.toUpperCase() ?? "?"}
                    color={selectedSpot.lastReport.profile.avatar_color}
                    size="tiny"
                  />
                  Last reported by {selectedSpot.lastReport.profile.display_name.split(" ")[0]}
                  {" · "}
                  {relTime(selectedSpot.lastReport.created_at)}
                </div>
              )}
            </Link>
          )}
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <div className="px-0 pt-1">
          <div className="flex items-baseline justify-between px-[22px] pt-2.5 pb-1.5">
            <div>
              <h3
                className="text-[18px] text-bark-900"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Nearby spots
              </h3>
              <div className="text-[12px] text-muted-fg">
                {sortedList.length} spots · sorted by walk time
              </div>
            </div>
            <button
              onClick={() => setMode("map")}
              className="inline-flex gap-1 items-center text-[11px] text-bark-700 font-medium bg-cream-100 px-2.5 py-1 rounded-full"
            >
              <Icons.Map width={12} height={12} />
              Map view
            </button>
          </div>
          <div className="px-[22px] flex flex-col gap-2.5">
            {sortedList.map((s) => {
              const cls = occClass(s.occPct);
              const lr = s.lastReport?.profile;
              return (
                <Link
                  key={s.id}
                  href={`/app/spot/${s.id}`}
                  className="bg-white border border-line rounded-[18px] p-3.5 flex gap-3.5 items-center hover:border-bark-300 transition active:scale-[0.99]"
                >
                  <div
                    className="h-14 w-14 rounded-2xl grid place-items-center text-bark-700 flex-none"
                    style={{
                      background: "linear-gradient(135deg, var(--color-cream-200), var(--color-cream-300))",
                      fontFamily: "var(--font-display)",
                      fontSize: 24,
                    }}
                  >
                    {s.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-semibold text-bark-900 tracking-tight">
                      {s.name}
                    </h4>
                    <div className="text-[12px] text-muted-fg mt-0.5 flex items-center gap-1.5 flex-wrap">
                      {s.walk_min} min
                      <i className="h-[3px] w-[3px] rounded-full bg-bark-300" />
                      {s.reportCount} reports
                      {lr && (
                        <>
                          <i className="h-[3px] w-[3px] rounded-full bg-bark-300" />
                          {lr.display_name.split(" ")[0]} · {relTime(s.lastReport!.created_at)}
                        </>
                      )}
                    </div>
                    <div className="mt-2 h-1 bg-cream-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cls === "open" ? "bg-open" : cls === "fill" ? "bg-fill" : "bg-full"}`}
                        style={{ width: `${s.occPct}%` }}
                      />
                    </div>
                  </div>
                  <OccPill pct={s.occPct} mode="pct" />
                </Link>
              );
            })}
            {sortedList.length === 0 && (
              <div className="text-center py-10 text-muted-fg text-[13px]">
                <h3 className="font-display text-[20px] text-bark-700 mb-1.5">
                  No spots match
                </h3>
                Try removing a filter or two.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Pin({
  spot,
  selected,
  onClick,
}: {
  spot: SpotComputed;
  selected: boolean;
  onClick: () => void;
}) {
  const cls = occClass(spot.occPct);
  const dotColor = cls === "open" ? "var(--color-open)" : cls === "fill" ? "var(--color-fill)" : "var(--color-full)";
  const pulseColor = cls === "open" ? "rgba(111,155,108,0.45)" : cls === "fill" ? "rgba(211,154,59,0.45)" : "rgba(196,90,74,0.45)";
  return (
    <button
      data-pin
      onClick={onClick}
      className="absolute pointer-events-auto cursor-pointer transition-transform active:scale-95"
      style={{
        left: `${spot.pos.x}%`,
        top: `${spot.pos.y}%`,
        transform: "translate(-50%, -100%)",
      }}
    >
      {/* Pulse */}
      <span
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{
          width: 12,
          height: 12,
          background: pulseColor,
          transform: "translate(-50%, -50%)",
          animation: "ssPulse 2.4s cubic-bezier(.4,0,.2,1) infinite",
        }}
      />
      {/* Bubble */}
      <div
        className="relative rounded-full pl-1.5 pr-2.5 py-1 flex items-center gap-1.5 border text-[12px] font-semibold"
        style={{
          background: selected ? "var(--color-bark-900)" : "white",
          color: selected ? "var(--color-cream-50)" : "var(--color-bark-800)",
          borderColor: "rgba(46,28,10,0.06)",
          boxShadow: "0 4px 8px rgba(46,28,10,0.25), 0 1px 2px rgba(46,28,10,0.18)",
          transform: selected ? "scale(1.06)" : "scale(1)",
        }}
      >
        <span
          className="rounded-full"
          style={{ width: 10, height: 10, background: dotColor, boxShadow: "0 0 0 3px rgba(255,255,255,0.85)" }}
        />
        {spot.walk_min} min
        <span
          className="absolute left-1/2 -bottom-[5px] w-2.5 h-2.5"
          style={{
            background: selected ? "var(--color-bark-900)" : "white",
            transform: "translateX(-50%) rotate(45deg)",
            borderRight: selected ? "none" : "1px solid rgba(46,28,10,0.06)",
            borderBottom: selected ? "none" : "1px solid rgba(46,28,10,0.06)",
          }}
        />
      </div>
      <span
        className="absolute -bottom-1 left-1/2 rounded-full"
        style={{
          width: 22,
          height: 6,
          background: "rgba(46,28,10,0.18)",
          transform: "translateX(-50%)",
          filter: "blur(2px)",
        }}
      />
      <style>{`@keyframes ssPulse { 0%{transform:translate(-50%,-50%) scale(1);opacity:0.6} 80%,100%{transform:translate(-50%,-50%) scale(2.6);opacity:0} }`}</style>
    </button>
  );
}
