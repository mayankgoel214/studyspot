"use client";

import { useActionState } from "react";
import { sendMagicLink, type SignInState } from "./actions";

const initial: SignInState = { status: "idle" };

export function SignInForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(sendMagicLink, initial);

  if (state.status === "sent") {
    return (
      <div className="auth-card text-center">
        <div className="mb-4 mx-auto h-14 w-14 rounded-full grid place-items-center bg-open-50 text-open">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M4 4h16v16H4zM4 8l8 5 8-5" />
          </svg>
        </div>
        <h1 className="font-display text-3xl text-bark-900 leading-[1.05] tracking-tight">
          Check your <em className="text-bark-700">inbox.</em>
        </h1>
        <p className="text-sm text-muted-fg mt-2 leading-relaxed">
          We sent a sign-in link to <b className="text-bark-900">{state.email}</b>.
          Tap it on this device to come back signed in.
        </p>
        <p className="text-xs text-bark-500 mt-6">
          Didn&rsquo;t arrive? Check spam, or wait a moment and{" "}
          <button
            onClick={() => window.location.reload()}
            className="underline underline-offset-2"
          >
            try again
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <div className="mb-5 inline-flex items-center gap-1.5 text-bark-500 text-xs font-medium tracking-wide uppercase">
        <span className="h-2 w-2 rounded-full bg-open" /> StudySpot · VT
      </div>
      <h1 className="font-display text-[34px] leading-[1.05] tracking-tight text-bark-900">
        Welcome back, <em className="text-bark-700">Hokie.</em>
      </h1>
      <p className="text-sm text-muted-fg mt-2 leading-relaxed">
        Enter your email and we&rsquo;ll send you a one-tap sign-in link. New here?
        We&rsquo;ll set up your account at the same time.
      </p>

      <form action={action} className="mt-7 space-y-3">
        <input type="hidden" name="next" value={next ?? ""} />
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-muted-fg font-semibold mb-2">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            autoFocus
            autoComplete="email"
            placeholder="you@vt.edu"
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
          className="w-full mt-2 inline-flex items-center justify-between bg-bark-900 hover:bg-bark-800 text-cream-50 rounded-2xl px-5 py-4 text-[15px] font-semibold transition-colors disabled:opacity-60"
        >
          <span>{pending ? "Sending link…" : "Send sign-in link"}</span>
          <span className="h-7 w-7 rounded-full bg-white/10 grid place-items-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </span>
        </button>

        <p className="text-[11px] text-bark-500 text-center pt-3 leading-relaxed">
          By continuing you agree to our terms.<br />
          No password, no spam — just the magic link.
        </p>
      </form>
    </div>
  );
}
