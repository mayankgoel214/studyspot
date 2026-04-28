import type { SVGProps } from "react";

const base: SVGProps<SVGSVGElement> = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const Icons = {
  Search: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  ),
  Quiet: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M11 5 6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
    </svg>
  ),
  Outlets: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="9" cy="10" r="1.5" />
      <circle cx="15" cy="10" r="1.5" />
      <path d="M8 16h8" />
    </svg>
  ),
  Wifi: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 20h.01M2 8.8a15 15 0 0 1 20 0" />
    </svg>
  ),
  Clock: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  Group: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.9" />
      <circle cx="9" cy="7" r="4" />
      <path d="M16 3.1a4 4 0 0 1 0 7.7" />
    </svg>
  ),
  ArrowLeft: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} strokeWidth={2.5} {...p}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  ),
  ArrowRight: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} strokeWidth={2.5} {...p}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  ),
  Heart: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="m12 21-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" />
    </svg>
  ),
  HeartFill: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="m12 21-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" />
    </svg>
  ),
  Share: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
    </svg>
  ),
  Map: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} strokeWidth={1.8} {...p}>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" />
    </svg>
  ),
  Calendar: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} strokeWidth={1.8} {...p}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  User: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} strokeWidth={1.8} {...p}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  ),
  Check: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} strokeWidth={3.5} {...p}>
      <path d="M5 12l5 5 9-9" />
    </svg>
  ),
  Direction: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M3 11l18-8-8 18-2-8z" />
    </svg>
  ),
  Bell: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-4-5.7V5a2 2 0 0 0-4 0v.3A6 6 0 0 0 6 11v3.2a2 2 0 0 1-.6 1.4L4 17h5M9 17v1a3 3 0 0 0 6 0v-1" />
    </svg>
  ),
  Help: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  ),
  Info: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} {...p}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <path d="M17 21v-8H7v8M7 3v5h8" />
    </svg>
  ),
  Sort: (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...base} strokeWidth={2.5} {...p}>
      <path d="M3 6h18M6 12h12M10 18h4" />
    </svg>
  ),
};
