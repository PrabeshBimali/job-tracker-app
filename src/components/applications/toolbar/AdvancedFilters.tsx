import { SlidersHorizontal } from "lucide-react";

export default function AdvancedFilters() {
  return (
    <button
      className="flex cursor-pointer items-center gap-2 border border-secondary-color bg-background-color px-4 py-2 text-sm transition-colors hover:border-button-color"
    >
      <SlidersHorizontal size={16} />
      Filters
    </button>
  );
}