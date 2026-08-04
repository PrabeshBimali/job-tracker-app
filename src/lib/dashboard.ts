import type { BarChartItem } from "../components/dashboard/SummaryBarChart";
import type { ApplicationType } from "../components/form/ApplicationForm";

export interface SummaryData {
  total: number;
  toApply: number;
  applied: number;
  inProgress: number;
  offer: number;
  rejected: number;
  declined: number;
  ghosted: number;
  favorite: number;
  archived: number;
}

export interface Dashboard {
  summaryData: SummaryData;
  statusChartData: BarChartItem[];
  nextActionChartData: BarChartItem[];
  workModeChartData: BarChartItem[];
  workTypeChartData: BarChartItem[];
}

function createSummary(applications: ApplicationType[]): SummaryData {
  const totalSum: SummaryData = {
    total: applications.length,
    toApply: 0,
    applied: 0,
    inProgress: 0,
    offer: 0,
    rejected: 0,
    declined: 0,
    ghosted: 0,
    favorite: 0,
    archived: 0
  }

  for(const application of applications) {
    switch(application.status) {
      case "To Apply":
        totalSum.toApply += 1;
        break;
      case "Applied":
        totalSum.applied += 1;
        break;
      case "In Progress":
        totalSum.inProgress += 1;
        break;
      case "Offer":
        totalSum.offer += 1;
        break;
      case "Rejected":
        totalSum.rejected += 1;
        break;
      case "Declined":
        totalSum.declined += 1;
        break;
      case "Ghosted":
        totalSum.ghosted += 1;
        break;
      default:
        const _exhaustive: never = application.status;
        throw new Error(`Unhandled status: ${_exhaustive}`);
    }

    if(application.favorite) totalSum.favorite += 1;
    if(application.archived) totalSum.archived += 1;
  }

  return totalSum;
}

export function createStatusChartData(applications: ApplicationType[]): BarChartItem[] {
  const counts: Record<ApplicationType["status"], number> = {
    "To Apply": 0,
    Applied: 0,
    "In Progress": 0,
    Offer: 0,
    Rejected: 0,
    Declined: 0,
    Ghosted: 0,
  };

  for (const application of applications) {
    counts[application.status]++;
  }

  return [
    {
      label: "Applied",
      value: counts.Applied,
    },
    {
      label: "To Apply",
      value: counts["To Apply"],
    },
    {
      label: "Rejected",
      value: counts.Rejected,
    },
    {
      label: "In Progress",
      value: counts["In Progress"],
    },
    {
      label: "Offer",
      value: counts.Offer,
    },
    {
      label: "Ghosted",
      value: counts.Ghosted,
    }
  ];
}

export function createNextActionChartData(
  applications: ApplicationType[]
): BarChartItem[] {
  const counts: Record<ApplicationType["nextAction"], number> = {
    None: 0,
    "Follow Up": 0,
    Interview: 0,
    Assessment: 0,
  };

  for (const application of applications) {
    counts[application.nextAction]++;
  }

  return [
    { label: "Follow Up", value: counts["Follow Up"] },
    { label: "Interview", value: counts.Interview },
    { label: "Assessment", value: counts.Assessment },
    { label: "None", value: counts.None },
  ];
}

export function createWorkModeChartData(
  applications: ApplicationType[]
): BarChartItem[] {
  const counts: Record<ApplicationType["workMode"], number> = {
    Remote: 0,
    Hybrid: 0,
    "On-site": 0,
  };

  for (const application of applications) {
    counts[application.workMode]++;
  }

  return [
    { label: "Remote", value: counts.Remote },
    { label: "Hybrid", value: counts.Hybrid },
    { label: "On-site", value: counts["On-site"] },
  ];
}

export function createWorkTypeChartData(
  applications: ApplicationType[]
): BarChartItem[] {
  const counts: Record<ApplicationType["workType"], number> = {
    "Full-time": 0,
    "Part-time": 0,
    Contract: 0,
    Internship: 0,
    Freelance: 0,
  };

  for (const application of applications) {
    counts[application.workType]++;
  }

  return [
    { label: "Full-time", value: counts["Full-time"] },
    { label: "Part-time", value: counts["Part-time"] },
    { label: "Contract", value: counts.Contract },
    { label: "Internship", value: counts.Internship },
    { label: "Freelance", value: counts.Freelance },
  ];
}


export function createDashboard(applications: ApplicationType[]): Dashboard {
  return {
    summaryData: createSummary(applications),
    statusChartData: createStatusChartData(applications),
    nextActionChartData: createNextActionChartData(applications),
    workModeChartData: createWorkModeChartData(applications),
    workTypeChartData: createWorkTypeChartData(applications)
  }
}