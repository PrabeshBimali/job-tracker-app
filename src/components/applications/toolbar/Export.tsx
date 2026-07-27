import { FileDown } from "lucide-react";
import type { ApplicationType } from "../../form/ApplicationForm";
import exportCsv from "../../../lib/exportCsv";
import { useState } from "react";

interface ExportCsvProps {
  filteredApplications: ApplicationType[]
}

export default function ExportCsv({ filteredApplications }: ExportCsvProps) {

  const [ isExporting, setIsExporting ] = useState<boolean>(false);

  function onExport(applications: ApplicationType[]) {
    setIsExporting(true);
    const cleanApplications = applications.map((app) => {
      const { createdAt, updatedAt, ...clean } = app;
      return clean;
    })

    exportCsv(cleanApplications)
    setIsExporting(false);
  }
  
  return (
    <div className="group relative">
      <button
        disabled={isExporting}  
        onClick={() => onExport(filteredApplications)}  
        className="flex px-4 py-2 cursor-pointer items-center justify-center border border-secondary-color bg-background-color transition-colors hover:border-button-color"
        aria-label="Export CSV"
      >
        <FileDown size={18} />
      </button>

      <div
        className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap border border-secondary-color bg-primary-color px-2 py-1 text-xs opacity-0 shadow-lg transition-all duration-150 group-hover:opacity-100"
      >
        Export CSV
      </div>
    </div>
  );
}