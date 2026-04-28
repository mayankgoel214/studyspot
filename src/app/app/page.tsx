import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AppHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, year, major, avatar_color")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="stage">
      <div className="phone">
        <div className="phone__notch" />
        <div className="phone__screen p-6 overflow-y-auto no-scrollbar">
          <div className="pt-12 pb-8">
            <div
              className="font-display text-[34px] leading-tight text-bark-900"
              style={{ fontFamily: "var(--font-display)" }}
            >
              hey, <em className="text-bark-700">{profile?.display_name?.split(" ")[0] ?? "there"}.</em>
            </div>
            <p className="text-sm text-muted-fg mt-1">
              You&rsquo;re signed in. The full app shell is being built — Phase B.
            </p>
          </div>

          <div className="space-y-3">
            <div className="bg-white border border-line rounded-2xl p-4">
              <div className="text-[11px] uppercase tracking-wide text-muted-fg font-semibold">
                Profile
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div
                  className="h-12 w-12 rounded-full grid place-items-center text-cream-50"
                  style={{ background: profile?.avatar_color ?? "#3a2614", fontFamily: "var(--font-display)", fontSize: "20px" }}
                >
                  {profile?.display_name?.[0] ?? "?"}
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-bark-900">
                    {profile?.display_name}
                  </div>
                  <div className="text-xs text-muted-fg">
                    {profile?.year} · {profile?.major}
                  </div>
                </div>
              </div>
            </div>

            <form action="/sign-out" method="post">
              <button
                type="submit"
                className="w-full bg-cream-100 border border-line rounded-2xl px-4 py-3 text-sm text-bark-700 font-medium"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
