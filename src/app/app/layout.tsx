import { PhoneFrame, StatusBar } from "@/components/PhoneFrame";

/**
 * The app shell.
 *
 * It used to redirect anyone without a session to /sign-in, which was a second
 * gate behind the middleware and would have quietly undone opening the map up.
 * Routes that genuinely need an account — bookings, saved, profile, and the
 * booking flow — are named in src/lib/supabase/middleware.ts, and that is the
 * only place the decision is made now.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PhoneFrame>
      <StatusBar />
      {children}
    </PhoneFrame>
  );
}
