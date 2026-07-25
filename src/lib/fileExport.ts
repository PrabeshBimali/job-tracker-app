import type { ApplicationType } from "../components/form/ApplicationForm";

const DEFAULT_FILE_NAME = "job-applications.csv"

const headers: string[] = [
  "id",
  "Company Name",
  "Role",
  "Job Url",
  "Location",
  "Status",
  "Work Mode",
  "Work Type",
  "Date Applied",
  "Next Action",
  "Next Action Date",
  "Notes",
  "Favorite",
  "Archived"
];

function escapeCsv(value: unknown): string {
  const text = String(value ?? "");

  return `"${text.replace(/"/g, '""')}"`;
}

function buildApplications(applications: ApplicationType[]): Blob {
  const finalData: string[] = [];
  finalData.push(headers.join(",") + "\n");

  for(const application of applications) {

    const app = [
      application.id,
      application.company,
      application.role,
      application.jobUrl,
      application.location,
      application.status,
      application.workMode,
      application.workType,
      application.dateApplied,
      application.nextAction,
      application.nextActionDate,
      application.notes,
      application.favorite,
      application.archived
    ];

    const cleanApp = app.map(val => escapeCsv(val));
    finalData.push(cleanApp.join(",") + "\n");
  }

  return new Blob(finalData, { type: "text/csv;charset=utf-8" });
}

function downloadFile(blob: Blob, filename: string) {
  const downloadUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(downloadUrl);
}

export function exportApplicationsCsv(applications: ApplicationType[]) {
  const blob = buildApplications(applications);
  downloadFile(blob, DEFAULT_FILE_NAME);
}