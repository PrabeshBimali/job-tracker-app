import Searchbar from "./Searchbar";
import StatusFilter from "./StatusFilter";
import SortDropdown from "./SortDropdown";
import AdvancedFilters from "./AdvancedFilters";

export default function ApplicationToolbar() {
  return (
    <section className="mb-6 border border-secondary-color bg-primary-color p-4 text-text-color">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <Searchbar />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <StatusFilter />

          <div className="flex gap-2">
            <SortDropdown />
            <AdvancedFilters />
          </div>
        </div>

      </div>
    </section>
  );
}