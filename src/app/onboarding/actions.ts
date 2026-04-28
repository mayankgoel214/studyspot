"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const PALETTE = [
  "#6f9b6c",
  "#d39a3b",
  "#c45a4a",
  "#6b4f37",
  "#8a6e54",
  "#5a8b6e",
  "#a78c70",
  "#7a9659",
  "#3a2614",
];

const Schema = z.object({
  display_name: z.string().min(1).max(60),
  year: z.enum(["Freshman", "Sophomore", "Junior", "Senior", "Grad", "Other"]),
  major: z.string().min(1).max(80),
  next: z.string().optional(),
});

export type OnboardingState =
  | { status: "idle" }
  | { status: "error"; message: string };

export async function completeOnboarding(
  _prev: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  const parsed = Schema.safeParse({
    display_name: formData.get("display_name"),
    year: formData.get("year"),
    major: formData.get("major"),
    next: formData.get("next") ?? undefined,
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]!.message };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Not signed in." };

  const color =
    PALETTE[Math.abs(hash(user.id)) % PALETTE.length] ?? PALETTE[0]!;

  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        display_name: parsed.data.display_name,
        year: parsed.data.year,
        major: parsed.data.major,
        avatar_color: color,
      },
      { onConflict: "id" },
    );

  if (error) return { status: "error", message: error.message };
  redirect(parsed.data.next || "/app");
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}
