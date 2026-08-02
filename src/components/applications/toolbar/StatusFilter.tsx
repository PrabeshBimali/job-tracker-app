import { useEffect, useRef, useState } from "react";
import { JOB_STATUSES } from "../../../lib/constants";
import type { JobStatus } from "../../form/ApplicationForm";
import { ChevronDown } from "lucide-react";

interface StatusFilterProps {
  selectedStatuses: JobStatus[];
  updateStatuses: (statuses: JobStatus[]) => void;
}

export default function StatusFilter({ selectedStatuses, updateStatuses }: StatusFilterProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleStatus(status: JobStatus) {
    const updated = selectedStatuses.includes(status) ? selectedStatuses.filter((s) => s !== status) : [...selectedStatuses, status];

    updateStatuses(updated);
  }

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 border border-secondary-color bg-background-color px-4 py-2 text-sm cursor-pointer hover:border-button-color"
      >
        <span>
          {selectedStatuses.length === 0
            ? "All Statuses"
            : `${selectedStatuses.length} Selected`}
        </span>

        <ChevronDown
          size={16}
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-56 border border-secondary-color bg-primary-color shadow-lg">
          <button
            type="button"
            onClick={() => updateStatuses([])}
            className="w-full border-b border-secondary-color px-4 py-2 text-left text-sm hover:bg-background-color"
          >
            All Statuses
          </button>

          {JOB_STATUSES.map((status) => (
            <label
              key={status}
              className="flex cursor-pointer items-center gap-3 px-4 py-2 text-sm hover:bg-background-color"
            >
              <input
                type="checkbox"
                checked={selectedStatuses.includes(status)}
                onChange={() => toggleStatus(status)}
              />

              {status}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}