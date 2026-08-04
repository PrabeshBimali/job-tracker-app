import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import Modal from "../../Modal";
import MultiSelectChips from "../../common/MultiSelectChips";
import type { NextAction, WorkMode, WorkType } from "../../form/ApplicationForm";
import Checkbox from "../../common/Checkbox";
import type { ApplicationFilters } from "../ApplicationView";
import { NEXT_ACTIONS, WORK_MODES, WORK_TYPES } from "../../../lib/constants";

interface AdvancedFiltersProps {
  workModes: WorkMode[];
  workTypes: WorkType[];
  nextActions: NextAction[];
  favoriteOnly: boolean;
  includeArchived: boolean

  updateFilter: <K extends keyof ApplicationFilters>( key: K, value: ApplicationFilters[K] ) => void;
}

export default function AdvancedFilters( { workModes, workTypes, nextActions, favoriteOnly, includeArchived, updateFilter } : AdvancedFiltersProps) {
  const [open, setOpen] = useState(false);

  function resetFilters() {
    updateFilter("workModes", []);
    updateFilter("workTypes", []);
    updateFilter("nextActions", []);
    updateFilter("favoriteOnly", false);
    updateFilter("includeArchived", false);
  }

  return (
    <>
      <div className="group relative">
        <button
          onClick={() => setOpen(true)}
          className="flex cursor-pointer items-center gap-2 border border-secondary-color bg-background-color px-4 py-2 text-sm transition-colors hover:border-button-color"
        >
          <SlidersHorizontal size={16} />
        </button>
        <div
          className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap border border-secondary-color bg-primary-color px-2 py-1 text-xs opacity-0 shadow-lg transition-all duration-150 group-hover:opacity-100"
        >
          Filters
        </div>
      </div>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        width="700px"
      >
        <div className="space-y-8 text-text-color">

          <div className="border-b border-secondary-color pb-4">
            <h2 className="text-xl font-semibold">
              Advanced Filters
            </h2>

            <p className="mt-1 text-sm text-text-color/60">
              Narrow your job applications.
            </p>
          </div>

          <MultiSelectChips<WorkMode>
            title="Work Mode"
            options={WORK_MODES}
            selected={workModes}
            onChange={(changed) => updateFilter("workModes", changed)}
          />

          <MultiSelectChips<WorkType>
            title="Work Type"
            options={WORK_TYPES}
            selected={workTypes}
            onChange={(changed) => updateFilter("workTypes", changed)}
          />

          <MultiSelectChips<NextAction>
            title="Next Action"
            options={NEXT_ACTIONS}
            selected={nextActions}
            onChange={(changed) => updateFilter("nextActions", changed)}
          />

          <div className="border-t border-secondary-color pt-6 space-y-4">

            <Checkbox
              checked={favoriteOnly}
              onChange={(updated) => updateFilter("favoriteOnly", updated)}
              label="Favorites only"
              description="Show only starred applications"
            />

            <Checkbox
              checked={includeArchived}
              onChange={(upated) => updateFilter("includeArchived", upated)}
              label="Include archived"
              description="Include archived applications in the list"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-secondary-color pt-6">

            <button
              type="button"
              onClick={resetFilters}
              className="cursor-pointer border border-secondary-color px-4 py-2 text-sm hover:border-button-color"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="cursor-pointer bg-button-color px-4 py-2 text-sm font-semibold text-background-color hover:bg-button-color/90"
            >
              Apply Filters
            </button>

          </div>

        </div>
      </Modal>
    </>
  );
}