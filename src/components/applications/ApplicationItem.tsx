import { useState } from "react";
import type { ApplicationType } from "../form/ApplicationForm";
import ApplicationRow from "./ApplicationRow";
import ExpandedRow from "./ExpandedRow";
import ApplicationFormModal from "../form/ApplicationFormModal";

interface ApplicationItemProps {
  application: ApplicationType;
  onDelete: (application: ApplicationType) => void;
  onToggleMetadata: (application: ApplicationType, field: "favorite" | "archived") => void;
}

export default function ApplicationItem({ application, onDelete, onToggleMetadata }: ApplicationItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [ isEditOpen, setIsEditOpen ] = useState(false);

  return (
    <>
      <ApplicationRow
        application={application}
        expanded={expanded}
        onToggle={() => setExpanded(prev => !prev)}
        onToggleMetadata={onToggleMetadata}
      />

      <ExpandedRow
        application={application}
        expanded={expanded}
        onDelete={onDelete}
        onToggleMetadata={onToggleMetadata}
        openEditForm={() => setIsEditOpen(true)}
      />

      <ApplicationFormModal
        formData={application}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(!isEditOpen)}
      />
    </>
  );
}