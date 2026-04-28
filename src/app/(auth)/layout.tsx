export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="stage">
      <div className="phone">
        <div className="phone__notch" />
        <div className="phone__screen flex flex-col justify-center px-6">
          {children}
        </div>
      </div>
      <div
        className="absolute top-7 left-8 hidden md:block text-[22px] tracking-tight desktop-tag"
        style={{
          color: "rgba(247, 241, 225, 0.55)",
          fontFamily: "var(--font-display)",
        }}
      >
        <em className="not-italic">
          <span style={{ fontStyle: "italic", color: "rgba(247,241,225,0.78)" }}>
            StudySpot
          </span>
        </em>
        <span> — VT Study Space Finder</span>
      </div>
    </div>
  );
}
