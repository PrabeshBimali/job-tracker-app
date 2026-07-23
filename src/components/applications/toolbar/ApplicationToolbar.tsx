import Searchbar from "./Searchbar";
import StatusFilter from "./StatusFilter";
import SortDropdown, { type SortOption } from "./SortDropdown";
import AdvancedFilters from "./AdvancedFilters";
import type { JobStatus, NextAction, WorkMode, WorkType } from "../../form/ApplicationForm";
import type { ApplicationFilters } from "../ApplicationView";

interface ApplicationToolbarProps {
  selectedStatuses: JobStatus[];
  updateStatuses: (statues: JobStatus[]) => void;

  search: string;
  updateSearch: (search: string) => void;

  sortBy: SortOption;
  updateSortBy: (sortBy: SortOption) => void;
  
  workModes: WorkMode[];
  workTypes: WorkType[];
  nextActions: NextAction[];

  updateFilter: <K extends keyof ApplicationFilters>( key: K, value: ApplicationFilters[K] ) => void;
}

export default function ApplicationToolbar({
  selectedStatuses,
  updateStatuses,

  search,
  updateSearch,

  sortBy,
  updateSortBy,

  workModes,
  workTypes,
  nextActions,

  updateFilter

}: ApplicationToolbarProps) {

  return (
    <section className="mb-6 border border-secondary-color bg-primary-color p-4 text-text-color">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <Searchbar 
          search={search}
          updateSearch={updateSearch}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <StatusFilter 
            selectedStatuses={selectedStatuses}
            updateStatuses={updateStatuses}
          />

          <div className="flex gap-2">
            <SortDropdown 
              sortBy={sortBy}
              updateSortBy={updateSortBy}
            />
            <AdvancedFilters 
              workModes={workModes}
              workTypes={workTypes}
              nextActions={nextActions}
              updateFilter={updateFilter}
            />
          </div>
        </div>

      </div>
    </section>
  );
}