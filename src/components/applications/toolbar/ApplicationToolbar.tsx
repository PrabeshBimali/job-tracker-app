import Searchbar from "./Searchbar";
import StatusFilter from "./StatusFilter";
import SortDropdown, { type SortOption } from "./SortDropdown";
import AdvancedFilters from "./AdvancedFilters";
import type { JobStatus, NextAction, WorkMode, WorkType } from "../../form/ApplicationForm";
import type { ApplicationFilters } from "../ApplicationView";

interface ApplicationToolbarProps {
  selectedStatuses: JobStatus[];
  search: string;
  sortBy: SortOption;
  workModes: WorkMode[];
  workTypes: WorkType[];
  nextActions: NextAction[];
  includeFavorite: boolean;
  includeArchived: boolean;

  updateFilter: <K extends keyof ApplicationFilters>( key: K, value: ApplicationFilters[K] ) => void;
}

export default function ApplicationToolbar({
  selectedStatuses,
  search,
  sortBy,
  workModes,
  workTypes,
  nextActions,
  includeFavorite,
  includeArchived,

  updateFilter

}: ApplicationToolbarProps) {

  return (
    <section className="mb-6 border border-secondary-color bg-primary-color p-4 text-text-color">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <Searchbar 
          search={search}
          updateSearch={(search: string) => updateFilter("search", search)}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <StatusFilter 
            selectedStatuses={selectedStatuses}
            updateStatuses={(updated: JobStatus[]) => updateFilter("statuses", updated)}
          />

          <div className="flex gap-2">
            <SortDropdown 
              sortBy={sortBy}
              updateSortBy={(updated: SortOption) => updateFilter("sortBy", updated)}
            />
            <AdvancedFilters 
              workModes={workModes}
              workTypes={workTypes}
              nextActions={nextActions}
              includeFavorite={includeFavorite}
              includeArchived={includeArchived}
              updateFilter={updateFilter}
            />
          </div>
        </div>

      </div>
    </section>
  );
}