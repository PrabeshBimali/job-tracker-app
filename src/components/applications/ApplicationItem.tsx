import { useState } from "react";
import type { ApplicationType } from "../form/AddApplicationForm";
import ApplicationRow from "./ApplicationRow";
import ExpandedRow from "./ExpandedRow";
import React from "react";

interface ApplicationItemProps {
  application: ApplicationType;
  onDelete: (application: ApplicationType) => void;
  onToggleMetadata: (application: ApplicationType, field: "favorite" | "archived") => void;
}

function ApplicationItem({ application, onDelete, onToggleMetadata }: ApplicationItemProps) {
  const [expanded, setExpanded] = useState(false);

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
      />
    </>
  );
}

export default React.memo(ApplicationItem);