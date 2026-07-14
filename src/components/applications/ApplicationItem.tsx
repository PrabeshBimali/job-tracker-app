import { useState } from "react";
import type { ApplicationType } from "../form/AddApplicationForm";
import ApplicationRow from "./ApplicationRow";
import ExpandedRow from "./ExpandedRow";

interface ApplicationItemProps {
  application: ApplicationType;
  onDelete: (application: ApplicationType) => void;
}

export default function ApplicationItem({ application, onDelete }: ApplicationItemProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <ApplicationRow
        application={application}
        expanded={expanded}
        onToggle={() => setExpanded(prev => !prev)}
      />

      <ExpandedRow
        application={application}
        expanded={expanded}
        onDelete={onDelete}
      />
    </>
  );
}