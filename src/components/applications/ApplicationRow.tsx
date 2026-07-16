import { ChevronDown, Star } from "lucide-react";
import type { ApplicationType } from "../form/ApplicationForm";

interface ApplicationRowProps {
  application: ApplicationType;
  expanded: boolean;
  onToggle: () => void;
  onToggleMetadata: (application: ApplicationType, field: "favorite" | "archived") => void;
}

export default function ApplicationRow({ application, expanded, onToggle, onToggleMetadata }: ApplicationRowProps) {
  return (
    <tr
      onClick={onToggle}
      className="cursor-pointer border-b border-secondary-color hover:bg-background-color transition-colors text-text-color"
    >
      <td className="px-2 md:px-5 py-2 md:py-4 w-10">
        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </td>

      <td className="px-5 py-2 md:py-4">
        <div className="text-sm md:text-md font-semibold tracking-wide">
          {application.company}
        </div>
      </td>

      <td className="px-5 py-2 md:py-4 text-sm hidden md:table-cell">
        {application.role}
      </td>

      <td className="px-5 py-2">
        {/* badge goes here later */}
        {application.status}
      </td>

      <td className="px-5 py-2 md:py-4 whitespace-nowrap hidden md:table-cell">
        {application.dateApplied}
      </td>

      <td className="px-5 py-2 md:py-4 hidden md:table-cell">
        {application.nextAction}
      </td>

      <td className="px-5 py-2 md:py-4 text-center">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMetadata(application, "favorite");
          }}
          className="cursor-pointer text-yellow-500 hover:scale-110 transition-transform"
        >
          <Star
            size={20}
            fill={application.favorite ? "currentColor" : "none"}
          />
        </button>
      </td>
    </tr>
  );
}