import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  // Without this the generated og:image resolves to a relative URL and the
  // link-preview card comes out blank.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
  title: "StudySpot — Find a place to study at VT",
  description:
    "StudySpot helps Virginia Tech students find an open seat, the right vibe, and book a group room in three taps. Live, crowdsourced occupancy from your peers.",
  applicationName: "StudySpot",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "StudySpot",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "StudySpot — Find a place to study at VT",
    description:
      "Live, crowdsourced occupancy for VT study spaces. Find an open seat before you walk over.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf8f0" },
    { media: "(prefers-color-scheme: dark)", color: "#2a1b0d" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${instrument.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
