import Link from "next/link";
import { getMyBookings } from "@/lib/queries";
import { TabBar } from "@/components/TabBar";
import { formatHHMMAmPm } from "@/lib/domain";

export default async function BookingsPage() {
  const all = await getMyBookings();
  const now = Date.now();
  const upcoming = all.filter(
    (b) => new Date(b.starts_at).getTime() + b.duration_min * 60000 >= now && b.status !== "cancelled",
  );
  const past = all.filter(
    (b) => new Date(b.starts_at).getTime() + b.duration_min * 60000 < now || b.status === "cancelled",
  );

  return (
    <>
      <div className="absolute inset-0 overflow-y-auto no-scrollbar pb-[110px]">
        <div className="px-[22px] pt-[60px] pb-1.5">
          <h1
            className="text-[32px] tracking-tight text-bark-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your bookings
          </h1>
          <p className="text-[13px] text-muted-fg mt-1">Upcoming rooms and recent visits.</p>
        </div>

        <SectionHeader>Upcoming</SectionHeader>
        {upcoming.length === 0 ? (
          <Empty>No upcoming bookings. Find a spot on the map.</Empty>
        ) : (
          upcoming.map((b) => <BookingCard key={b.id} b={b} variant="upcoming" />)
        )}

        <SectionHeader>Past</SectionHeader>
        {past.length === 0 ? (
          <Empty>No past visits yet.</Empty>
        ) : (
          past.map((b) => <BookingCard key={b.id} b={b} variant="past" />)
        )}
      </div>
      <TabBar />
    </>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mx-[22px] mt-5 mb-2.5 text-[12px] uppercase tracking-wider text-muted-fg font-semibold">
      {children}
    </h3>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center py-10 px-6 text-muted-fg text-[13px]">{children}</div>
  );
}

function BookingCard({
  b,
  variant,
}: {
  b: import("@/lib/queries").BookingWithSpot;
  variant: "upcoming" | "past";
}) {
  const startsAt = new Date(b.starts_at);
  const dateStr = startsAt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const timeStr = formatHHMMAmPm(b.starts_at);
  const minsToStart = Math.round((startsAt.getTime() - Date.now()) / 60000);

  return (
    <Link
      href={`/app/spot/${b.spot.id}`}
      className="relative mx-[22px] mb-2.5 p-4 bg-white border border-line rounded-[20px] flex gap-3.5 overflow-hidden block"
    >
      <span
        className="absolute top-0 left-0 bottom-0 w-1"
        style={{ background: variant === "upcoming" ? "var(--color-open)" : "var(--color-bark-300)" }}
      />
      <div
        className="w-[60px] h-[60px] rounded-[14px] grid place-items-center flex-none"
        style={{
          background:
            variant === "past"
              ? "var(--color-cream-100)"
              : "linear-gradient(135deg, var(--color-cream-200), var(--color-cream-300))",
          color: variant === "past" ? "var(--color-bark-400)" : "var(--color-bark-700)",
          fontFamily: "var(--font-display)",
          fontSize: 24,
        }}
      >
        {b.spot.initial}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[15px] font-semibold text-bark-900 tracking-tight">{b.spot.name}</h4>
        <div className="text-[12px] text-muted-fg mt-0.5">
          {dateStr} · {timeStr} · {b.duration_min} min
        </div>
        <div className="inline-block mt-1.5 text-[12px] text-bark-700 bg-cream-100 px-2 py-0.5 rounded-full">
          {b.room.name}
        </div>
        {variant === "upcoming" && minsToStart > 0 && (
          <div className="mt-1.5 text-[11px] text-open font-semibold uppercase tracking-wider">
            {minsToStart < 60
              ? `Starts in ${minsToStart}m`
              : `Starts in ${Math.floor(minsToStart / 60)}h ${minsToStart % 60}m`}
          </div>
        )}
      </div>
    </Link>
  );
}
