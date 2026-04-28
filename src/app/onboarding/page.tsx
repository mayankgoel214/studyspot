import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingForm } from "./form";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, year, major")
    .eq("id", user.id)
    .maybeSingle();

  // If already complete, no need to be here
  if (profile?.year && profile?.major) {
    redirect(sp.next || "/app");
  }

  const initialName =
    profile?.display_name ?? user.email?.split("@")[0] ?? "";

  return (
    <div className="stage">
      <div className="phone">
        <div className="phone__notch" />
        <div className="phone__screen overflow-y-auto no-scrollbar">
          <OnboardingForm initialName={initialName} next={sp.next} email={user.email ?? ""} />
        </div>
      </div>
    </div>
  );
}
