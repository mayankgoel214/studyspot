import { redirect } from "next/navigation";
import { getMyProfile, getMyReportCount, getMyBookings } from "@/lib/queries";
import { TabBar } from "@/components/TabBar";
import { Avatar } from "@/components/Avatar";
import { Icons } from "@/lib/icons";

export default async function ProfilePage() {
  const [profile, reportCount, bookings] = await Promise.all([
    getMyProfile(),
    getMyReportCount(),
    getMyBookings(),
  ]);
  if (!profile) redirect("/sign-in");

  const studiedHours = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((acc, b) => acc + b.duration_min, 0) / 60;

  return (
    <>
      <div className="absolute inset-0 overflow-y-auto no-scrollbar pb-[110px]">
        <div className="px-[22px] pt-[60px] pb-2">
          <h1
            className="text-[32px] tracking-tight text-bark-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Profile
          </h1>
          <p className="text-[13px] text-muted-fg mt-1">
            Your study habits, settings, and preferences.
          </p>
        </div>

        <div className="mx-[22px] p-5 bg-white border border-line rounded-[22px] flex items-center gap-3.5">
          <Avatar
            initial={profile.display_name[0]?.toUpperCase() ?? "?"}
            color={profile.avatar_color}
            size="large"
          />
          <div>
            <h2
              className="text-[22px] text-bark-900 tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {profile.display_name}
            </h2>
            <p className="text-[12px] text-muted-fg mt-0.5">
              <span className="text-bark-700">{profile.year ?? "Student"}</span>
              {profile.major ? ` · ${profile.major}` : ""}
            </p>
          </div>
        </div>

        <div className="mx-[22px] mt-4 grid grid-cols-3 gap-2">
          <PStat value={String(bookings.length)} label="Bookings" />
          <PStat value={Math.round(studiedHours).toString()} label="Hours studied" suffix="h" />
          <PStat value={String(reportCount)} label="Reports this week" />
        </div>

        <div className="mx-[22px] mt-4 bg-white border border-line rounded-[18px] overflow-hidden">
          <MenuRow
            icon={<Icons.Bell width={16} height={16} />}
            title="Notifications"
            subtitle="Booking reminders, full-spot alerts"
          />
          <MenuRow
            icon={<Icons.Help width={16} height={16} />}
            title="Help & feedback"
            subtitle="Tell us what's missing"
          />
          <MenuRow
            icon={<Icons.Info width={16} height={16} />}
            title="About StudySpot"
            subtitle="Built for VT · CS 3724 · Spring 2026"
          />
        </div>

        <form action="/sign-out" method="post" className="mx-[22px] mt-4">
          <button
            type="submit"
            className="w-full bg-cream-100 border border-line rounded-[18px] px-4 py-3.5 text-[14px] text-bark-700 font-medium"
          >
            Sign out
          </button>
        </form>

        <p
          className="text-center text-[11px] text-bark-400 mt-6 italic"
          style={{ fontFamily: "var(--font-display)" }}
        >
          — Team User First · Group 8 —
        </p>
      </div>
      <TabBar />
    </>
  );
}

function PStat({ value, label, suffix }: { value: string; label: string; suffix?: string }) {
  return (
    <div className="bg-cream-100 px-3 py-3.5 rounded-[14px] text-center">
      <div className="text-[24px] text-bark-900" style={{ fontFamily: "var(--font-display)" }}>
        {value}
        {suffix && <small className="text-[14px]">{suffix}</small>}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-muted-fg mt-0.5">{label}</div>
    </div>
  );
}

function MenuRow({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 not-first:border-t not-first:border-line">
      <span className="w-8 h-8 rounded-[9px] bg-cream-100 grid place-items-center text-bark-700">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <h5 className="text-[14px] font-medium text-bark-900">{title}</h5>
        <p className="text-[11px] text-muted-fg mt-0.5">{subtitle}</p>
      </div>
      <Icons.ArrowRight width={16} height={16} className="text-bark-400" />
    </div>
  );
}
