import type { SummaryData } from "../../lib/dashboard";

interface SummaryRowProps {
  summaryData: SummaryData
}

export default function SummaryRow({ summaryData }: SummaryRowProps) {

  const summaryItems = {
    Total: summaryData.total,
    "To Apply": summaryData.toApply,
    Applied: summaryData.applied,
    "In Progress": summaryData.inProgress,
    Offer: summaryData.offer,
    Rejected: summaryData.rejected,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {Object.entries(summaryItems).map(([label, value]) => (
        <div
          key={label}
          className="border border-secondary-color bg-primary-color p-4"
        >
          <p className="text-sm text-text-color/70">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold text-text-color">
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}