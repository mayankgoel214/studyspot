import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Icons } from "@/lib/icons";
import { formatHHMMAmPm } from "@/lib/domain";

export default async function BookedPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const [{ id: spotId }, { id: bookingId }] = await Promise.all([params, searchParams]);
  if (!bookingId) redirect(`/app/spot/${spotId}`);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: booking } = await supabase
    .from("bookings")
    .select(
      `id, starts_at, duration_min,
       spot:spots!inner(id, name, walk_min),
       room:rooms!inner(id, name, floor)`,
    )
    .eq("id", bookingId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!booking) notFound();

  const b = booking as unknown as {
    id: string;
    starts_at: string;
    duration_min: number;
    spot: { id: string; name: string; walk_min: number };
    room: { id: string; name: string; floor: string };
  };

  return (
    <div
      className="absolute inset-0 overflow-y-auto no-scrollbar"
      style={{
        background:
          "radial-gradient(circle at 50% 0%, rgba(217,230,212,0.6) 0%, transparent 60%), var(--color-cream-50)",
      }}
    >
      <div className="px-[22px] pt-[100px] text-center pb-32">
        <div
          className="relative w-[100px] h-[100px] rounded-full bg-open grid place-items-center mx-auto mb-5"
          style={{ boxShadow: "0 12px 32px -8px rgba(111,155,108,0.5)" }}
        >
          <Icons.Check width={48} height={48} className="text-white" strokeWidth={4} />
          <span
            className="absolute rounded-full pointer-events-none"
            style={{
              inset: -10,
              border: "2px solid var(--color-open-50)",
              animation: "ssRing 2s ease-out infinite",
            }}
          />
        </div>

        <h1
          className="text-[36px] leading-[1.05] tracking-tight text-bark-900"
          style={{ fontFamily: "var(--font-display)" }}
        >
          You&rsquo;re <em className="text-bark-700">all set.</em>
        </h1>
        <p className="text-[14px] text-muted-fg mt-2.5 leading-relaxed">
          Walk over when you&rsquo;re ready — we&rsquo;ve held the room for you.
        </p>

        <div
          className="relative mt-7 bg-white border border-line rounded-[22px] p-4.5 text-left"
          style={{
            padding: 18,
            boxShadow: "0 6px 18px -8px rgba(46,28,10,0.18), 0 2px 4px rgba(46,28,10,0.04)",
          }}
        >
          <Row k="Spot" v={b.spot.name} big />
          <Row k="Room" v={b.room.name} />
          <Row k="When" v={`Today, ${formatHHMMAmPm(b.starts_at)}`} />
          <Row k="Length" v={`${b.duration_min} min`} />
          <Row k="Walk time" v={`${b.spot.walk_min} min from where you are`} />
        </div>

        <div className="mt-5 flex flex-col gap-2.5">
          <Link
            href="/app/bookings"
            className="flex items-center justify-between bg-bark-900 text-cream-50 rounded-[18px] px-5 py-4 text-[15px] font-semibold hover:bg-bark-800 transition"
          >
            See my bookings
            <span className="h-[30px] w-[30px] rounded-full bg-white/10 grid place-items-center">
              <Icons.Calendar width={14} height={14} />
            </span>
          </Link>
          <Link
            href="/app"
            className="flex items-center justify-center bg-cream-100 border border-line text-bark-700 rounded-[18px] px-5 py-4 text-[15px] font-medium"
          >
            Back to map
          </Link>
        </div>
      </div>
      <style>{`@keyframes ssRing { 0% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(1.4); opacity: 0; } }`}</style>
    </div>
  );
}

function Row({ k, v, big }: { k: string; v: string; big?: boolean }) {
  return (
    <div className="flex justify-between items-start py-2 first:pt-0 not-first:border-t not-first:border-dashed not-first:border-line">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-muted-fg">{k}</div>
      </div>
      <div
        className={`text-bark-900 font-semibold tracking-tight text-right ${big ? "text-[16px]" : "text-[14px]"}`}
        style={big ? { fontFamily: "var(--font-display)", fontWeight: 400 } : undefined}
      >
        {v}
      </div>
    </div>
  );
}
