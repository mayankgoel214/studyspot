"use client";

import { useActionState } from "react";
import { completeOnboarding, type OnboardingState } from "./actions";

const initial: OnboardingState = { status: "idle" };
const YEARS = ["Freshman", "Sophomore", "Junior", "Senior", "Grad", "Other"] as const;

export function OnboardingForm({
  initialName,
  next,
  email,
}: {
  initialName: string;
  next?: string;
  email: string;
}) {
  const [state, action, pending] = useActionState(completeOnboarding, initial);

  return (
    <div className="px-7 pt-12 pb-10">
      <div className="font-display text-[40px] italic text-bark-900 leading-none mb-1">
        almost there<span className="text-open">.</span>
      </div>
      <p className="text-sm text-muted-fg mt-3 leading-relaxed">
        Tell us who you are so your reports show up with a name. You can change
        any of this later from your profile.
      </p>

      <form action={action} className="mt-7 space-y-4">
        <input type="hidden" name="next" value={next ?? ""} />

        <div>
          <label className="block text-[11px] uppercase tracking-wider text-muted-fg font-semibold mb-2">
            Display name
          </label>
          <input
            name="display_name"
            type="text"
            required
            defaultValue={initialName}
            placeholder="e.g. Priya Patel"
            maxLength={60}
            className="w-full bg-cream-50 border border-line rounded-2xl px-4 py-3.5 text-[15px] text-ink outline-none focus:border-bark-400 focus:bg-white transition-colors"
          />
          <p className="text-[11px] text-bark-500 mt-1.5">
            Signed in as <b className="text-bark-700">{email}</b>
          </p>
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-wider text-muted-fg font-semibold mb-2">
            Year
          </label>
          <div className="grid grid-cols-3 gap-2">
            {YEARS.map((y, i) => (
              <label
                key={y}
                className="relative cursor-pointer"
              >
                <input
                  type="radio"
                  name="year"
                  value={y}
                  required
                  defaultChecked={i === 2}
                  className="peer sr-only"
                />
                <div className="text-center bg-white border border-line rounded-xl py-3 text-[13px] font-medium text-bark-700 transition-all peer-checked:bg-bark-900 peer-checked:text-cream-50 peer-checked:border-bark-900 active:scale-[0.98]">
                  {y}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-wider text-muted-fg font-semibold mb-2">
            Major
          </label>
          <input
            name="major"
            type="text"
            required
            placeholder="e.g. Computer Science"
            maxLength={80}
            className="w-full bg-cream-50 border border-line rounded-2xl px-4 py-3.5 text-[15px] text-ink outline-none focus:border-bark-400 focus:bg-white transition-colors"
          />
        </div>

        {state.status === "error" && (
          <div className="text-xs text-full bg-full-50 px-3 py-2 rounded-lg">
            {state.message}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full inline-flex items-center justify-between bg-bark-900 hover:bg-bark-800 text-cream-50 rounded-2xl px-5 py-4 text-[15px] font-semibold transition-colors disabled:opacity-60 mt-2"
        >
          <span>{pending ? "Saving…" : "Find me a study spot"}</span>
          <span className="h-7 w-7 rounded-full bg-white/10 grid place-items-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      </form>
    </div>
  );
}
