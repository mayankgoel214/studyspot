type Size = "tiny" | "small" | "medium" | "large";

const SIZES: Record<Size, { px: number; fs: number }> = {
  tiny: { px: 18, fs: 10 },
  small: { px: 24, fs: 12 },
  medium: { px: 32, fs: 16 },
  large: { px: 64, fs: 28 },
};

export function Avatar({
  initial,
  color = "#6b4f37",
  size = "medium",
}: {
  initial: string;
  color?: string;
  size?: Size;
}) {
  const { px, fs } = SIZES[size];
  return (
    <span
      className="rounded-full grid place-items-center text-cream-50 flex-none"
      style={{
        width: px,
        height: px,
        background: color,
        fontFamily: "var(--font-display)",
        fontSize: fs,
        boxShadow: "0 0 0 1px rgba(46,28,10,0.04)",
      }}
    >
      {initial}
    </span>
  );
}
