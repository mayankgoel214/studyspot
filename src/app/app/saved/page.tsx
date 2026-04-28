import Link from "next/link";
import { getMySavedSpots } from "@/lib/queries";
import { TabBar } from "@/components/TabBar";
import { occClass, occLabel } from "@/lib/domain";

export default async function SavedPage() {
  const saved = await getMySavedSpots();
  return (
    <>
      <div className="absolute inset-0 overflow-y-auto no-scrollbar pb-[110px]">
        <div className="px-[22px] pt-[60px] pb-2">
          <h1 className="text-[32px] tracking-tight text-bark-900" style={{ fontFamily: "var(--font-display)" }}>
            Your spots
          </h1>
          <p className="text-[13px] text-muted-fg mt-1">The places you keep coming back to.</p>
        </div>

        {saved.length === 0 ? (
          <div className="text-center py-12 px-6">
            <h3
              className="text-[20px] text-bark-700 mb-1.5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Nothing saved yet
            </h3>
            <p className="text-muted-fg text-[13px]">
              Tap the heart on any spot to add it here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 px-[22px]">
            {saved.map((s) => {
              const cls = occClass(s.occPct);
              return (
                <Link
                  key={s.id}
                  href={`/app/spot/${s.id}`}
                  className="bg-white border border-line rounded-[18px] overflow-hidden block active:scale-[0.99] transition"
                >
                  <div
                    className="h-[90px] grid place-items-center text-bark-700"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--color-cream-200), var(--color-cream-300))",
                      fontFamily: "var(--font-display)",
                      fontSize: 28,
                    }}
                  >
                    {s.initial}
                  </div>
                  <div className="px-3 pt-2.5 pb-3">
                    <h5 className="text-[13px] font-semibold text-bark-900 tracking-tight">
                      {s.name}
                    </h5>
                    <div className="mt-1 text-[11px] text-muted-fg flex items-center gap-1.5">
                      <i
                        className={`h-1.5 w-1.5 rounded-full ${
                          cls === "open" ? "bg-open" : cls === "fill" ? "bg-fill" : "bg-full"
                        }`}
                      />
                      {occLabel(s.occPct)} · {s.walk_min} min
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <TabBar />
    </>
  );
}
