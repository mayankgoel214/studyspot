"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Icons } from "@/lib/icons";
import { TIME_SLOTS, type RoomRow, type SpotComputed } from "@/lib/domain";
import { createBooking } from "../actions";

type Step = "room" | "time" | "confirm";
const ORDER: Step[] = ["room", "time", "confirm"];

export function BookingFlow({
  spot,
  rooms,
}: {
  spot: SpotComputed;
  rooms: RoomRow[];
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("room");
  const [roomId, setRoomId] = useState<string | null>(rooms[0]?.id ?? null);
  const [time, setTime] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(60);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const room = rooms.find((r) => r.id === roomId) ?? null;

  function pickRoom(id: string) {
    setRoomId(id);
    setTimeout(() => setStep("time"), 150);
  }

  function pickTime(t: string) {
    setTime(t);
    setTimeout(() => setStep("confirm"), 150);
  }

  function confirm() {
    if (!roomId || !time) return;
    setError(null);
    const fd = new FormData();
    fd.set("spot_id", spot.id);
    fd.set("room_id", roomId);
    fd.set("time_slot", time);
    fd.set("duration_min", String(duration));
    startTransition(async () => {
      const res = await createBooking(fd);
      // On success, createBooking calls redirect()
      if (res && !res.ok) setError(res.error ?? "Booking failed");
    });
  }

  function back() {
    if (step === "confirm") setStep("time");
    else if (step === "time") setStep("room");
    else router.back();
  }

  return (
    <div className="absolute inset-0 overflow-y-auto no-scrollbar pb-32">
      <button
        onClick={back}
        className="absolute top-[60px] left-[18px] w-[38px] h-[38px] rounded-full bg-white/90 backdrop-blur grid place-items-center border border-bark-900/[0.06] z-20 shadow-sm active:scale-95 transition-transform"
      >
        <Icons.ArrowLeft width={18} height={18} />
      </button>

      <div className="pt-[60px] pb-2.5 flex justify-center">
        <h1
          className="text-[26px] text-bark-900 tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {step === "room" ? "Pick a room" : step === "time" ? "Pick a time" : "Confirm"}
        </h1>
      </div>

      {/* Step indicator */}
      <div className="flex gap-1.5 mx-[22px] mt-1.5 mb-1">
        {ORDER.map((s, i) => {
          const order = ORDER.indexOf(s);
          const active = step === s;
          const done = ORDER.indexOf(step) > order;
          return (
            <div
              key={s}
              className={`flex-1 px-3 py-2.5 rounded-xl border transition ${
                active
                  ? "bg-bark-900 border-bark-900"
                  : done
                    ? "bg-open-50 border-[rgba(111,155,108,0.3)]"
                    : "bg-cream-100 border-transparent"
              }`}
            >
              <div
                className={`text-[10px] uppercase tracking-wider font-semibold ${
                  active ? "text-cream-50/60" : done ? "text-[#3a5d39]/70" : "text-bark-500"
                }`}
              >
                Step {i + 1}
              </div>
              <div
                className={`text-[13px] font-semibold tracking-tight ${
                  active ? "text-cream-50" : done ? "text-[#3a5d39]" : "text-bark-700"
                }`}
              >
                {done && "✓ "}
                {s === "room" ? "Room" : s === "time" ? "Time" : "Confirm"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-[22px] pt-4">
        {step === "room" && (
          <>
            <div
              className="text-[24px] leading-tight text-bark-900 mb-3.5 tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Pick a room <em className="text-bark-700">at {spot.name}</em>
            </div>
            <div className="space-y-2.5">
              {rooms.map((r) => (
                <RoomCard
                  key={r.id}
                  room={r}
                  selected={roomId === r.id}
                  onClick={() => pickRoom(r.id)}
                />
              ))}
            </div>
          </>
        )}

        {step === "time" && (
          <>
            <RoomReview room={room} spotName={spot.name} className="mb-4" />
            <div
              className="text-[24px] leading-tight text-bark-900 mb-3.5 tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              When works <em className="text-bark-700">for you?</em>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot.t}
                  disabled={!slot.available}
                  onClick={() => pickTime(slot.t)}
                  className={`py-3.5 rounded-[14px] border text-[13px] font-semibold transition active:scale-[0.98] ${
                    time === slot.t
                      ? "border-bark-900 bg-bark-900 text-cream-50"
                      : slot.available
                        ? "bg-white border-line text-bark-800 hover:border-bark-300"
                        : "bg-cream-100 border-line text-bark-400 cursor-not-allowed opacity-60"
                  }`}
                >
                  {slot.t}
                </button>
              ))}
            </div>
          </>
        )}

        {step === "confirm" && (
          <>
            <RoomReview room={room} spotName={spot.name} />
            <h3 className="mt-6 mb-3 text-[12px] uppercase tracking-wider text-muted-fg font-semibold">
              Duration
            </h3>
            <div className="flex gap-2">
              {[30, 60, 90, 120].map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`flex-1 py-3 rounded-xl border text-[13px] font-medium transition ${
                    duration === d
                      ? "bg-bark-900 border-bark-900 text-cream-50"
                      : "bg-white border-line text-bark-700"
                  }`}
                >
                  {d} min
                </button>
              ))}
            </div>
            <div className="mt-5 bg-cream-100 rounded-[18px] p-4">
              {[
                ["Spot", spot.name],
                ["Room", room?.name ?? ""],
                ["Date", "Today"],
                ["Start", time ?? ""],
                ["Duration", `${duration} minutes`],
              ].map(([k, v], i) => (
                <div
                  key={k}
                  className={`flex justify-between items-center py-1.5 text-[13px] ${
                    i > 0 ? "border-t border-dashed border-line" : ""
                  }`}
                >
                  <span className="text-muted-fg">{k}</span>
                  <span className="text-bark-900 font-semibold">{v}</span>
                </div>
              ))}
            </div>
            {error && (
              <div className="mt-3 text-xs text-full bg-full-50 px-3 py-2 rounded-lg">{error}</div>
            )}
            <div className="sticky bottom-0 -mx-[22px] px-[22px] pt-4 pb-7 mt-5 bg-gradient-to-b from-transparent to-cream-50">
              <button
                onClick={confirm}
                disabled={pending}
                className="w-full flex items-center justify-between bg-bark-900 text-cream-50 rounded-[18px] px-5 py-4 text-[15px] font-semibold hover:bg-bark-800 active:scale-[0.99] transition disabled:opacity-60 shadow-[0_8px_24px_-10px_rgba(46,28,10,0.4)]"
              >
                {pending ? "Booking…" : "Confirm booking"}
                <span className="h-[30px] w-[30px] rounded-full bg-white/10 grid place-items-center">
                  <Icons.Check width={14} height={14} />
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function RoomCard({
  room,
  selected,
  onClick,
}: {
  room: RoomRow;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-white rounded-[18px] p-4 flex gap-3.5 items-center text-left transition active:scale-[0.99] ${
        selected ? "border-[1.5px] border-bark-900 bg-cream-100" : "border-[1.5px] border-line hover:border-bark-300"
      }`}
    >
      <div
        className="w-14 h-14 rounded-[14px] grid place-items-center text-white flex-none"
        style={{ background: "linear-gradient(135deg, #e9dcb6, #c6ad7c)" }}
      >
        <Icons.Group width={28} height={28} />
      </div>
      <div className="flex-1 min-w-0">
        <h5 className="text-[15px] font-semibold text-bark-900 tracking-tight">{room.name}</h5>
        <p className="text-[12px] text-muted-fg mt-0.5 flex items-center gap-1.5">
          {room.floor} <i className="h-[3px] w-[3px] rounded-full bg-bark-300" /> seats {room.capacity}
        </p>
      </div>
      <div
        className={`w-[22px] h-[22px] rounded-full grid place-items-center transition ${
          selected ? "bg-bark-900 text-cream-50 border-[1.5px] border-bark-900" : "border-[1.5px] border-line text-transparent"
        }`}
      >
        <Icons.Check width={11} height={11} />
      </div>
    </button>
  );
}

function RoomReview({
  room,
  spotName,
  className = "",
}: {
  room: RoomRow | null;
  spotName: string;
  className?: string;
}) {
  if (!room) return null;
  return (
    <div className={`bg-white rounded-[18px] p-4 border border-line flex items-center gap-3.5 ${className}`}>
      <div
        className="w-14 h-14 rounded-[14px] grid place-items-center text-white flex-none"
        style={{ background: "linear-gradient(135deg, #e9dcb6, #c6ad7c)" }}
      >
        <Icons.Group width={28} height={28} />
      </div>
      <div>
        <h5 className="text-[15px] font-semibold text-bark-900 tracking-tight">{room.name}</h5>
        <p className="text-[12px] text-muted-fg mt-0.5">
          {spotName} · {room.floor}
        </p>
      </div>
    </div>
  );
}
