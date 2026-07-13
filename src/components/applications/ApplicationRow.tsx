import { ChevronDown, Star } from "lucide-react";
import type { ApplicationType } from "./AddApplicationForm";

interface ApplicationRowProps {
  application: ApplicationType;
  expanded: boolean;
}

export default function ApplicationRow({
  application,
  expanded,
}: ApplicationRowProps) {
  return (
    <tr
      /*onClick={onToggle}*/
      className="cursor-pointer border-b border-secondary-color hover:bg-background-color transition-colors text-text-color"
    >
      <td className="px-5 py-2 md:py-4 w-10">
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

      <td className="px-5 py-2 md:py-4 text-center text-yellow-400">
        <Star
          size={18}
          fill={application.favorite ? "currentColor" : "none"}
        />
      </td>
    </tr>
  );
}