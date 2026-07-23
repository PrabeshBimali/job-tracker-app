import type { JobStatus } from "../../form/ApplicationForm";

const statuses: JobStatus[] = [
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];

interface StatusFilterProps {
  selectedStatuses: JobStatus[];
  updateStatuses: (statuses: JobStatus[]) => void;
}

export default function StatusFilter( { selectedStatuses, updateStatuses } : StatusFilterProps) {

  function toggleStatus(status: JobStatus) {
    const newStatuses = selectedStatuses.includes(status) ? selectedStatuses.filter(s => s !== status) : [...selectedStatuses, status];
    updateStatuses(newStatuses);
  }

  const selectedClass = "px-3 py-2 cursor-pointer text-sm border transition-colors bg-accent-color text-white border-button-color";
  const normalClass = "px-3 py-2 cursor-pointer text-sm border transition-colors bg-primary-color border-secondary-color hover:bg-background-color";

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => updateStatuses([])}
        className={selectedStatuses.length === 0 ? selectedClass : normalClass}
      >
          All
      </button>

      {statuses.map(status => (
        <button
          key={status}
          onClick={() => toggleStatus(status)}
          className={selectedStatuses.includes(status) ? selectedClass : normalClass}
        >
          {status}
        </button>
      ))}
    </div>
  );
}