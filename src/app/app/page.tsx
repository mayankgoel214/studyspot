import { getActiveReporterCount, getMyProfile, getSpotsComputed } from "@/lib/queries";
import { TabBar } from "@/components/TabBar";
import { MapListView } from "./_components/MapListView";

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<{ filters?: string; view?: string }>;
}) {
  const sp = await searchParams;
  const [profile, spots, reporterCount] = await Promise.all([
    getMyProfile(),
    getSpotsComputed(),
    getActiveReporterCount(),
  ]);

  const filters = (sp.filters?.split(",").filter(Boolean) as Filter[]) ?? [];
  const view = sp.view === "list" ? "list" : "map";

  return (
    <>
      <MapListView
        profile={profile}
        spots={spots}
        reporterCount={reporterCount}
        initialFilters={filters}
        initialView={view}
      />
      <TabBar />
    </>
  );
}

type Filter = "all" | "quiet" | "outlets" | "wifi" | "open";
