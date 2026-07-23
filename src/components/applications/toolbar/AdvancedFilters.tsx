import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import Modal from "../../Modal";
import MultiSelectChips from "./MultiSelectChips";
import type { NextAction, WorkMode, WorkType } from "../../form/ApplicationForm";
import Checkbox from "../../form/Checkbox";
import type { ApplicationFilters } from "../ApplicationView";

interface AdvancedFiltersProps {
  workModes: WorkMode[];
  workTypes: WorkType[];
  nextActions: NextAction[];

  updateFilter: <K extends keyof ApplicationFilters>( key: K, value: ApplicationFilters[K] ) => void;
}

export default function AdvancedFilters( { workModes, workTypes, nextActions, updateFilter } : AdvancedFiltersProps) {
  const [open, setOpen] = useState(false);

 // const [workModes, setWorkModes] = useState<WorkMode[]>([]);
 // const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
 // const [nextActions, setNextActions] = useState<NextAction[]>([]);

  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [includeArchived, setIncludeArchived] = useState(false);

  function resetFilters() {
    updateFilter("workModes", []);
    updateFilter("workTypes", []);
    updateFilter("nextActions", []);
    setFavoritesOnly(false);
    setIncludeArchived(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex cursor-pointer items-center gap-2 border border-secondary-color bg-background-color px-4 py-2 text-sm transition-colors hover:border-button-color"
      >
        <SlidersHorizontal size={16} />
        Filters
      </button>

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
            options={["Remote", "Hybrid", "On-site"]}
            selected={workModes}
            onChange={(changed) => updateFilter("workModes", changed)}
          />

          <MultiSelectChips<WorkType>
            title="Work Type"
            options={[ "Full-time", "Part-time", "Contract", "Internship", "Freelance" ]}
            selected={workTypes}
            onChange={(changed) => updateFilter("workTypes", changed)}
          />

          <MultiSelectChips<NextAction>
            title="Next Action"
            options={[ "None", "Apply", "Interview", "Assessment", "Offer", "Follow Up" ]}
            selected={nextActions}
            onChange={(changed) => updateFilter("nextActions", changed)}
          />

          <div className="border-t border-secondary-color pt-6 space-y-4">

            <Checkbox
              checked={favoritesOnly}
              onChange={setFavoritesOnly}
              label="Favorites only"
              description="Show only starred applications"
            />

            <Checkbox
              checked={includeArchived}
              onChange={setIncludeArchived}
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