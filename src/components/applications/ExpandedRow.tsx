import type { ApplicationType } from "../form/AddApplicationForm";
import ApplicationDetail from "./ApplicationDetail";
import { Trash, Edit, Archive, ArchiveRestoreIcon } from "lucide-react";

interface Props {
  application: ApplicationType;
  expanded: boolean;
  onDelete: (application: ApplicationType) => void;
  onToggleMetadata: (application: ApplicationType, field: "favorite" | "archived") => void;
}

export default function ExpandedRow({ application, expanded, onDelete, onToggleMetadata }: Props) {
  if (!expanded) return null;

  return (
    <tr className="border-b border-secondary-color bg-background-color text-text-color">
      <td colSpan={7} className="p-6">
        <div className="pl-3 md:pl-10 lg:pl-20">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-text-color/70">
              Job Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:hidden">
              <ApplicationDetail label="Role">
                {application.role}
              </ApplicationDetail>
            </div>

            <div className="md:hidden">
              <ApplicationDetail label="Applied Date">
                {application.dateApplied}
              </ApplicationDetail>
            </div>
            <ApplicationDetail label="Work Mode">
                {application.workMode}
            </ApplicationDetail>

            <ApplicationDetail label="Work Type">
                {application.workType}
            </ApplicationDetail>

            <ApplicationDetail label="Location">
                {application.location || "—"}
            </ApplicationDetail>

            <ApplicationDetail label="Job URL">
                {
                  application.jobUrl ? (
                    <a
                        href={application.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-color text-sm hover:text-button-color"
                    >
                        Open Job Posting
                    </a>
                  )
                    : "—"
                }
            </ApplicationDetail>
          </div>
        </div>

        <div className="pt-6 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-text-color/70">
              Follow Up
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ApplicationDetail label="Next Action">
                  {application.nextAction}
              </ApplicationDetail>

              <ApplicationDetail label="Action Date">
                  {application.nextActionDate || "—"}
              </ApplicationDetail>
          </div>
        </div>

        <div className="pt-6 space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-text-color/70">
              Notes
          </h3>

          <p className="text-sm leading-7 whitespace-pre-wrap">
              {application.notes || "No notes added."}
          </p>
        </div>
        </div>

        <div className="border-t border-secondary-color pt-6 mt-6 flex flex-wrap justify-end gap-3">
          <button
              type="button"
              className="px-4 py-2 flex items-center gap-2 font-semibold bg-button-color text-white cursor-pointer hover:bg-button-color/80"
          >
            <span>
              <Edit size={18}/>
            </span>
            <span>
              Edit
            </span>
          </button>

          <button
              type="button"
              onClick={() => onToggleMetadata(application, "archived")}
              className="px-4 py-2 flex items-center gap-2 font-semibold bg-accent-color text-white cursor-pointer hover:bg-accent-color/80"
          >
            <span>
              {
                application.archived ? <ArchiveRestoreIcon size={18}/> : <Archive size={18}/>
              }
            </span>
            <span>
              { application.archived ? "Restore" : "Archive" }
            </span>
          </button>

          <button
              type="button"
              onClick={() => onDelete(application)}
              className="px-4 py-2 flex items-center gap-2 font-semibold bg-error-color text-white cursor-pointer hover:opacity-90"
          >
            <span>
              <Trash size={18}/>
            </span>
            <span>
              Delete
            </span>
          </button>
        </div>
      </td>
    </tr>
  );
}