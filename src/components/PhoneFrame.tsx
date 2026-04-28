import type { ReactNode } from "react";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="stage">
      <div className="phone">
        <div className="phone__notch" />
        <div className="phone__screen">{children}</div>
      </div>
      <DesktopTag />
      <DesktopMeta />
    </div>
  );
}

function DesktopTag() {
  return (
    <div
      className="desktop-tag absolute top-7 left-8 hidden md:block tracking-tight z-10"
      style={{
        color: "rgba(247, 241, 225, 0.55)",
        fontFamily: "var(--font-display)",
        fontSize: 22,
      }}
    >
      <span style={{ fontStyle: "italic", color: "rgba(247,241,225,0.78)" }}>
        StudySpot
      </span>
      <span> — VT Study Space Finder</span>
    </div>
  );
}

function DesktopMeta() {
  return (
    <div
      className="desktop-meta absolute bottom-7 left-8 hidden md:block z-10"
      style={{
        color: "rgba(247, 241, 225, 0.45)",
        fontSize: 12,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        lineHeight: 1.7,
      }}
    >
      <span style={{ color: "rgba(247,241,225,0.7)" }}>Class</span>{" "}
      CS 3724 · Spring 2026
      <br />
      <span style={{ color: "rgba(247,241,225,0.7)" }}>Team</span>{" "}
      User First (Group 8)
      <br />
      <span style={{ color: "rgba(247,241,225,0.7)" }}>Phase</span>{" "}
      Production · Crowdsourced data
    </div>
  );
}

export function StatusBar() {
  return (
    <div
      className="status-bar"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px 0 32px",
        fontSize: 15,
        fontWeight: 600,
        color: "var(--color-bark-900)",
        zIndex: 40,
        pointerEvents: "none",
      }}
    >
      <span>9:41</span>
      <div className="flex gap-1.5 items-center">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <rect x="0" y="7" width="3" height="4" rx="0.6" />
          <rect x="4.5" y="5" width="3" height="6" rx="0.6" />
          <rect x="9" y="3" width="3" height="8" rx="0.6" />
          <rect x="13.5" y="0.5" width="3" height="10.5" rx="0.6" />
        </svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
          <path d="M8 2C5.4 2 3 3 1.2 4.7c-.3.3-.3.7 0 1l1 1c.3.3.7.3 1 0 1.3-1.3 3-2 4.8-2s3.5.7 4.8 2c.3.3.7.3 1 0l1-1c.3-.3.3-.7 0-1C13 3 10.6 2 8 2zm0 4C6.7 6 5.5 6.5 4.6 7.4c-.3.3-.3.7 0 1l1 1c.3.3.7.3 1 0 .4-.4.9-.6 1.4-.6s1 .2 1.4.6c.3.3.7.3 1 0l1-1c.3-.3.3-.7 0-1A4.7 4.7 0 0 0 8 6zm0 4c-.6 0-1.1.5-1.1 1.1S7.4 11 8 11s1.1-.5 1.1-1.1S8.6 10 8 10z" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="22" height="12" rx="3" stroke="currentColor" opacity="0.6" />
          <rect x="2" y="2" width="19" height="9" rx="1.5" fill="currentColor" />
          <rect x="24" y="4" width="2" height="5" rx="1" fill="currentColor" opacity="0.6" />
        </svg>
      </div>
    </div>
  );
}
