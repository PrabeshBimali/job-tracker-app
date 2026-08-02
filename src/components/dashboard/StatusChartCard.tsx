import { PieChart } from "lucide-react";

export default function StatusChartCard() {
  return (
    <div className="border border-secondary-color bg-primary-color p-5">
      <div className="flex items-center gap-2 mb-4">
        <PieChart
          size={20}
          className="text-accent-color"
        />

        <h2 className="text-lg font-semibold text-text-color">
          Status Distribution
        </h2>
      </div>

      <div className="flex items-center justify-center h-56">
        <p className="text-sm text-text-color/60">
          Chart coming soon.
        </p>
      </div>
    </div>
  );
}