import { ArrowUpDown } from "lucide-react";

export type SortOption = "Newest" | "Oldest" | "Company A-Z" | "Company Z-A" | "Status" | "Next Action"

export default function SortDropdown() {
  return (
    <div className="relative">

      <ArrowUpDown
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-secondary-color"
      />

      <select
        className="cursor-pointer border border-secondary-color bg-background-color py-2 pl-9 pr-8 text-sm outline-none transition-colors focus:border-button-color"
      >
        {(["Newest", "Oldest", "Company A-Z", "Company Z-A", "Status", "Next Action"] as SortOption[]).map(value => {
          return <option key={value}>{value}</option>
        })}
      </select>

    </div>
  );
}