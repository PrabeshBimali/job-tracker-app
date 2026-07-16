import { ArrowUpDown } from "lucide-react";

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
        <option>Newest</option>
        <option>Oldest</option>
        <option>Company A-Z</option>
        <option>Company Z-A</option>
        <option>Status</option>
      </select>

    </div>
  );
}