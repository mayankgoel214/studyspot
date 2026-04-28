"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/lib/icons";

const TABS = [
  { href: "/app", label: "Map", icon: Icons.Map, match: /^\/app(\?|$|\/$)/ },
  { href: "/app/bookings", label: "Bookings", icon: Icons.Calendar, match: /^\/app\/bookings/ },
  { href: "/app/saved", label: "Saved", icon: Icons.Heart, match: /^\/app\/saved/ },
  { href: "/app/profile", label: "Profile", icon: Icons.User, match: /^\/app\/profile/ },
];

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav
      className="tabbar"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(255, 251, 240, 0.9)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid var(--color-line)",
        padding: "8px 20px calc(22px + env(safe-area-inset-bottom, 0))",
        display: "flex",
        justifyContent: "space-between",
        zIndex: 30,
      }}
    >
      {TABS.map(({ href, label, icon: Icon, match }) => {
        const active = match.test(pathname);
        return (
          <Link
            key={href}
            href={href}
            prefetch
            className={`flex-1 flex flex-col items-center gap-[3px] py-2 px-1 text-[10px] font-semibold tracking-wide transition-colors ${
              active ? "text-bark-900" : "text-bark-500"
            }`}
          >
            <span
              className="relative grid place-items-center transition-transform active:scale-90"
              style={{ width: 22, height: 22 }}
            >
              {active && (
                <span
                  className="absolute inset-[-6px_-10px] rounded-full bg-cream-200"
                  style={{ zIndex: -1 }}
                />
              )}
              <Icon width={22} height={22} />
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
