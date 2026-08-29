"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Icons } from "@/lib/icons";
import { toggleSaved } from "../actions";

export function SaveButton({
  spotId,
  initialSaved,
}: {
  spotId: string;
  initialSaved: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  function click() {
    if (pending) return;
    const previous = saved;
    setSaved(!saved);
    const fd = new FormData();
    fd.set("spot_id", spotId);
    startTransition(async () => {
      const res = await toggleSaved(fd);
      if (!res.ok) {
        setSaved(previous);
        // Saving is one of the few things that genuinely needs an account, so a
        // signed-out tap is an invitation rather than a failure. Reporting
        // occupancy, which is the thing most visitors come to do, needs none.
        if (res.error === "Not signed in") {
          router.push(`/sign-in?next=${encodeURIComponent(pathname)}`);
        }
        return;
      }
      router.refresh();
    });
  }

  return (
    <button
      onClick={click}
      aria-label={saved ? "Unsave" : "Save"}
      className={`w-[38px] h-[38px] rounded-full bg-white/90 backdrop-blur grid place-items-center border border-bark-900/[0.06] shadow-sm active:scale-95 transition-transform ${
        saved ? "text-full" : "text-bark-800"
      }`}
    >
      {saved ? <Icons.HeartFill width={18} height={18} /> : <Icons.Heart width={18} height={18} />}
    </button>
  );
}
