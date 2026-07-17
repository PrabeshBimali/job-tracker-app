import Searchbar from "./Searchbar";
import StatusFilter from "./StatusFilter";
import SortDropdown from "./SortDropdown";
import AdvancedFilters from "./AdvancedFilters";
import { useState } from "react";
import type { JobStatus } from "../../form/ApplicationForm";

export default function ApplicationToolbar() {

  const [selectedStatuses, setSelectedStatuses] = useState<JobStatus[]>([]);

  function toggleStatus(status: JobStatus) {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  }

  return (
    <section className="mb-6 border border-secondary-color bg-primary-color p-4 text-text-color">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <Searchbar />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <StatusFilter 
            selectedStatuses={selectedStatuses}
            toggleStatus={toggleStatus}
            setSelectedStatuses={setSelectedStatuses}
          />

          <div className="flex gap-2">
            <SortDropdown />
            <AdvancedFilters />
          </div>
        </div>

      </div>
    </section>
  );
}