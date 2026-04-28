import { notFound } from "next/navigation";
import Link from "next/link";
import { getMySavedSpotIds, getSpotComputed } from "@/lib/queries";
import { Avatar } from "@/components/Avatar";
import { Icons } from "@/lib/icons";
import { occClass, occLabel, relTime, statusLabel } from "@/lib/domain";
import { ReportButtons } from "../../_components/ReportButtons";
import { SaveButton } from "../../_components/SaveButton";

export default async function SpotDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [data, savedIds] = await Promise.all([
    getSpotComputed(id),
    getMySavedSpotIds(),
  ]);
  if (!data) notFound();
  const { spot, rooms } = data;
  const isSaved = savedIds.has(id);

  const cls = occClass(spot.occPct);
  const ringColor = cls === "open" ? "#6f9b6c" : cls === "fill" ? "#d39a3b" : "#c45a4a";
  const ringR = 14;
  const ringC = 2 * Math.PI * ringR;
  const ringOff = ringC - (spot.occPct / 100) * ringC;

  const amenities = [
    { k: "quiet", label: "Quiet zones", icon: <Icons.Quiet width={16} height={16} />, on: spot.amenities.quiet },
    { k: "outlets", label: "Outlets", icon: <Icons.Outlets width={16} height={16} />, on: spot.amenities.outlets },
    { k: "wifi", label: "WiFi", icon: <Icons.Wifi width={16} height={16} />, on: spot.amenities.wifi },
    { k: "group", label: "Group rooms", icon: <Icons.Group width={16} height={16} />, on: spot.amenities.group },
  ];

  return (
    <div className="absolute inset-0 overflow-y-auto no-scrollbar pb-32">
      <Link
        href="/app"
        className="absolute top-[60px] left-[18px] w-[38px] h-[38px] rounded-full bg-white/90 backdrop-blur grid place-items-center border border-bark-900/[0.06] z-20 shadow-sm active:scale-95 transition-transform"
      >
        <Icons.ArrowLeft width={18} height={18} />
      </Link>
      <div className="absolute top-[60px] right-[18px] flex gap-2 z-20">
        <SaveButton spotId={spot.id} initialSaved={isSaved} />
      </div>

      {/* Hero */}
      <div
        className="relative grid place-items-center overflow-hidden"
        style={{
          height: 280,
          background: "linear-gradient(135deg, #d4c4a3 0%, #b89a72 60%, #91714a 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 100%, rgba(0,0,0,0.25), transparent), radial-gradient(60% 50% at 30% 30%, rgba(255,255,255,0.18), transparent)",
          }}
        />
        <div
          className="absolute top-[60px] left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider text-bark-800 border border-bark-900/[0.06]"
          dangerouslySetInnerHTML={{ __html: spot.type }}
        />
        <svg viewBox="0 0 200 200" fill="none" style={{ width: "60%", height: "60%", opacity: 0.85 }}>
          <rect x="40" y="60" width="120" height="120" rx="6" fill="#fbf8f0" opacity="0.95" />
          <rect x="55" y="78" width="20" height="24" rx="2" fill="#a78c70" opacity="0.5" />
          <rect x="85" y="78" width="20" height="24" rx="2" fill="#a78c70" opacity="0.5" />
          <rect x="115" y="78" width="20" height="24" rx="2" fill="#a78c70" opacity="0.5" />
          <rect x="55" y="112" width="20" height="24" rx="2" fill="#a78c70" opacity="0.5" />
          <rect x="115" y="112" width="20" height="24" rx="2" fill="#a78c70" opacity="0.5" />
          <rect x="92" y="112" width="16" height="60" rx="2" fill="#a78c70" opacity="0.6" />
          <path d="M30 70 L100 28 L170 70" stroke="#fbf8f0" strokeWidth="3" fill="#fbf8f0" opacity="0.95" />
          <rect x="50" y="180" width="100" height="6" fill="#a78c70" opacity="0.4" />
        </svg>
        <div className="absolute left-3.5 bottom-3.5 bg-white/95 backdrop-blur rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 border border-bark-900/[0.06] shadow-sm">
          <div className="relative w-9 h-9">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r={ringR} fill="none" stroke="#e2d5b8" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r={ringR}
                fill="none"
                stroke={ringColor}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={ringC}
                strokeDashoffset={ringOff}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-[11px] font-bold text-bark-900">
              {spot.occPct}%
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-fg">
              {occLabel(spot.occPct)}
            </div>
            <div className="text-[14px] font-semibold text-bark-900">
              {Math.round((100 - spot.occPct) / 2)} seats free
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-[22px] pt-5">
        <h1
          className="text-[32px] leading-[1.05] tracking-tight text-bark-900"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {spot.name}
        </h1>
        <div className="text-[13px] text-muted-fg mt-1 flex items-center gap-1.5">
          Virginia Tech
          <i className="h-[3px] w-[3px] rounded-full bg-bark-300" />
          <span dangerouslySetInnerHTML={{ __html: spot.type }} />
        </div>

        <div className="grid grid-cols-3 gap-2 mt-5 bg-cream-100 rounded-[18px] p-3.5">
          <Stat value={String(spot.walk_min)} label="walk" suffix="min" />
          <Stat value={`${spot.occPct}`} label={occLabel(spot.occPct)} suffix="%" border />
          <Stat
            value={String(rooms.length)}
            label={rooms.length === 1 ? "room" : "rooms"}
            border
          />
        </div>

        <p className="mt-4 text-[13.5px] leading-relaxed text-bark-700">{spot.description}</p>

        <SectionH>How busy is it right now?</SectionH>
        <ReportButtons spotId={spot.id} />

        <SectionH>
          Recent reports{" "}
          <span className="text-bark-400 font-medium normal-case tracking-normal text-[11px]">
            · {spot.reportCount} in the last 30 min
          </span>
        </SectionH>
        <RecentReports spot={spot} />

        <SectionH>Amenities</SectionH>
        <div className="grid grid-cols-2 gap-2.5">
          {amenities.map((a) => (
            <div
              key={a.k}
              className={`flex items-center gap-2.5 border border-line rounded-[14px] p-3 text-[13px] ${
                a.on ? "bg-white text-bark-800" : "bg-cream-50 text-bark-400"
              }`}
            >
              <span
                className={`h-[30px] w-[30px] rounded-[9px] grid place-items-center ${
                  a.on ? "bg-cream-100 text-bark-700" : "bg-cream-100 text-bark-300"
                }`}
              >
                {a.icon}
              </span>
              {a.label}
            </div>
          ))}
        </div>

        <SectionH>Hours</SectionH>
        <div className="bg-white border border-line rounded-[14px] p-3.5 flex items-center gap-3">
          <span className="h-9 w-9 rounded-[10px] bg-cream-100 grid place-items-center text-bark-700">
            <Icons.Clock width={16} height={16} />
          </span>
          <div className="flex-1">
            <div className="text-[11px] uppercase tracking-wider text-muted-fg">Today</div>
            <div className="text-[14px] text-bark-900 font-medium mt-0.5">{spot.hours}</div>
          </div>
          <span className="text-open font-semibold text-[12px]">
            {spot.open_now ? "Open now" : "Closed"}
          </span>
        </div>

        <div className="sticky bottom-0 -mx-[22px] px-[22px] pt-4 pb-7 mt-5 bg-gradient-to-b from-transparent to-cream-50">
          {spot.has_group_rooms && rooms.length > 0 ? (
            <Link
              href={`/app/spot/${spot.id}/book`}
              className="flex items-center justify-between bg-bark-900 text-cream-50 rounded-[18px] px-5 py-4 text-[15px] font-semibold hover:bg-bark-800 active:scale-[0.99] transition shadow-[0_8px_24px_-10px_rgba(46,28,10,0.4)]"
            >
              Book a group room
              <span className="h-[30px] w-[30px] rounded-full bg-white/10 grid place-items-center">
                <Icons.ArrowRight width={14} height={14} />
              </span>
            </Link>
          ) : (
            <button
              disabled
              className="w-full flex items-center justify-between bg-transparent border border-bark-900 text-bark-900 rounded-[18px] px-5 py-4 text-[15px] font-semibold opacity-90"
            >
              <span>No bookable rooms here</span>
              <span className="h-[30px] w-[30px] rounded-full bg-cream-200 grid place-items-center">
                <Icons.ArrowRight width={14} height={14} />
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({
  value,
  label,
  suffix,
  border,
}: {
  value: string;
  label: string;
  suffix?: string;
  border?: boolean;
}) {
  return (
    <div
      className={`text-center px-1.5 ${border ? "border-l border-line" : ""}`}
    >
      <div className="text-[17px] font-semibold text-bark-900">
        {value}
        {suffix && <small className="text-[11px] font-medium text-muted-fg ml-0.5">{suffix}</small>}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-muted-fg">{label}</div>
    </div>
  );
}

function SectionH({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-6 mb-3 text-[12px] uppercase tracking-wider text-muted-fg font-semibold">
      {children}
    </h3>
  );
}

function RecentReports({ spot }: { spot: import("@/lib/domain").SpotComputed }) {
  if (spot.recentReports.length === 0) {
    return (
      <div className="bg-white border border-line rounded-[18px] p-5 text-center text-muted-fg text-[12.5px]">
        No reports yet — be the first.
      </div>
    );
  }
  return (
    <div className="bg-white border border-line rounded-[18px] overflow-hidden">
      {spot.recentReports.map((r, i) => {
        const u = r.profile;
        if (!u) return null;
        return (
          <div
            key={r.id}
            className={`flex items-center gap-2.5 px-3.5 py-3 ${i > 0 ? "border-t border-line" : ""}`}
          >
            <Avatar
              initial={u.display_name[0]?.toUpperCase() ?? "?"}
              color={u.avatar_color}
              size="medium"
            />
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-semibold text-bark-900 tracking-tight">
                {u.display_name}
              </div>
              <div className="text-[11px] text-muted-fg mt-0.5">
                {u.year ?? "Student"}
                {u.major && ` · ${u.major}`}
                {" · "}
                {relTime(r.created_at)}
              </div>
            </div>
            <span
              className={`flex-none px-2.5 py-[3px] rounded-full text-[10px] font-semibold tracking-wide ${
                r.status === "open"
                  ? "bg-open-50 text-[#3a5d39]"
                  : r.status === "fill"
                    ? "bg-fill-50 text-[#7a5510]"
                    : "bg-full-50 text-[#803128]"
              }`}
            >
              {statusLabel(r.status)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
