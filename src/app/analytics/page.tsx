import { GeographyHeatmap } from "@/components/components/analytics/GeographyHeatmap";

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-zinc-50/60 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <GeographyHeatmap />
      </div>
    </main>
  );
}
