"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitReport } from "../actions";

const STATUSES: { id: "open" | "fill" | "full"; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "fill", label: "Filling" },
  { id: "full", label: "Full" },
];

export function ReportButtons({ spotId }: { spotId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [last, setLast] = useState<"open" | "fill" | "full" | null>(null);
  const [error, setError] = useState<string | null>(null);

  function send(status: "open" | "fill" | "full") {
    if (pending) return;
    setError(null);
    setLast(status);
    const fd = new FormData();
    fd.set("spot_id", spotId);
    fd.set("status", status);
    startTransition(async () => {
      const res = await submitReport(fd);
      if (!res.ok) {
        setError(res.error ?? "Couldn't submit report");
        setLast(null);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="bg-white border border-line rounded-[18px] p-3.5">
      <p className="text-[12.5px] text-muted-fg mb-3 leading-snug">
        {last
          ? `You reported "${last === "open" ? "Open" : last === "fill" ? "Filling" : "Full"}" — thanks for keeping the data fresh.`
          : "Tell your peers what you see right now."}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {STATUSES.map(({ id, label }) => (
          <button
            key={id}
            disabled={pending}
            onClick={() => send(id)}
            className={`flex flex-col items-center gap-1.5 py-3 rounded-[14px] border text-[12px] font-semibold transition active:scale-[0.97] ${
              last === id ? "border-bark-900 bg-bark-900 text-cream-50" : "border-line bg-cream-50 text-bark-800 hover:border-bark-300"
            }`}
          >
            <span
              className={`h-3.5 w-3.5 rounded-full ${id === "open" ? "bg-open" : id === "fill" ? "bg-fill" : "bg-full"}`}
              style={{ boxShadow: "0 0 0 3px rgba(255,255,255,0.6)" }}
            />
            {label}
          </button>
        ))}
      </div>
      {error && (
        <div className="text-xs text-full bg-full-50 px-3 py-2 rounded-lg mt-2">{error}</div>
      )}
    </div>
  );
}
