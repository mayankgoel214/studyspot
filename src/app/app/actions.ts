"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { slotToISO } from "@/lib/domain";
import { checkReportLimit, visitorKeyFrom } from "@/lib/rate-limit";

const ReportSchema = z.object({
  spot_id: z.string(),
  status: z.enum(["open", "fill", "full"]),
});

/**
 * Files an occupancy report.
 *
 * No account required. Asking someone to sign up before they can answer "is
 * this room busy right now" is how a crowdsourced product ends up with no
 * crowd, and it is why the deployed app was unusable to anyone who was not
 * already a user. A signed-in report carries its author; a signed-out one
 * carries none, and row-level security allows exactly those two shapes.
 */
export async function submitReport(formData: FormData) {
  const parsed = ReportSchema.safeParse({
    spot_id: formData.get("spot_id"),
    status: formData.get("status"),
  });
  if (!parsed.success) return { ok: false, error: "Invalid report" };

  const limit = checkReportLimit(visitorKeyFrom(await headers()));
  if (!limit.allowed) {
    return {
      ok: false,
      error: "That is a lot of reports in one hour. Try again a bit later.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("reports").insert({
    spot_id: parsed.data.spot_id,
    user_id: user?.id ?? null,
    status: parsed.data.status,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/app/spot/${parsed.data.spot_id}`);
  revalidatePath("/app");
  return { ok: true };
}

const SaveSchema = z.object({ spot_id: z.string() });

export async function toggleSaved(formData: FormData) {
  const parsed = SaveSchema.safeParse({ spot_id: formData.get("spot_id") });
  if (!parsed.success) return { ok: false, error: "Invalid spot" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };

  const { data: existing } = await supabase
    .from("saved_spots")
    .select("spot_id")
    .eq("user_id", user.id)
    .eq("spot_id", parsed.data.spot_id)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("saved_spots")
      .delete()
      .eq("user_id", user.id)
      .eq("spot_id", parsed.data.spot_id);
  } else {
    await supabase
      .from("saved_spots")
      .insert({ user_id: user.id, spot_id: parsed.data.spot_id });
  }

  revalidatePath(`/app/spot/${parsed.data.spot_id}`);
  revalidatePath("/app/saved");
  return { ok: true, saved: !existing };
}

const BookingSchema = z.object({
  spot_id: z.string(),
  room_id: z.string(),
  time_slot: z.string(),
  duration_min: z.coerce.number().int().min(15).max(240),
});

export async function createBooking(formData: FormData) {
  const parsed = BookingSchema.safeParse({
    spot_id: formData.get("spot_id"),
    room_id: formData.get("room_id"),
    time_slot: formData.get("time_slot"),
    duration_min: formData.get("duration_min"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Missing booking details" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };

  const startsAt = slotToISO(parsed.data.time_slot);

  // Conflict check via DB function
  const { data: conflict } = await supabase.rpc("has_booking_conflict", {
    p_room_id: parsed.data.room_id,
    p_starts_at: startsAt,
    p_duration_min: parsed.data.duration_min,
  });
  if (conflict) {
    return {
      ok: false,
      error: "That time slot was just taken — pick another.",
    };
  }

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      user_id: user.id,
      spot_id: parsed.data.spot_id,
      room_id: parsed.data.room_id,
      starts_at: startsAt,
      duration_min: parsed.data.duration_min,
      status: "upcoming",
    })
    .select("id")
    .single();

  if (error || !booking) {
    return { ok: false, error: error?.message ?? "Booking failed" };
  }

  revalidatePath("/app/bookings");
  redirect(`/app/spot/${parsed.data.spot_id}/booked?id=${booking.id}`);
}
