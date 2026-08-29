import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "../database.types";

// Only the routes that are private to one person. Browsing the map, opening a
// spot and reading its recent reports need no account — that is the whole
// product, and gating it behind a magic link is what made the deployed site
// unusable to anyone who was not already a user.
const PROTECTED = [
  "/app/bookings",
  "/app/saved",
  "/app/profile",
  "/onboarding",
];

// Booking a room is private too, but it lives under a spot's public detail
// page, so it is matched by suffix rather than by prefix.
const PROTECTED_SUFFIXES = ["/book"];
const AUTH_PAGES = ["/sign-in"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isProtected =
    PROTECTED.some((p) => path === p || path.startsWith(p + "/")) ||
    PROTECTED_SUFFIXES.some((suffix) => path.endsWith(suffix));
  const isAuthPage = AUTH_PAGES.some((p) => path === p || path.startsWith(p + "/"));

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }

  return response;
}
