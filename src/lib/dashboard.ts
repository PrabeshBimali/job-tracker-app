import type { ApplicationType } from "../components/form/ApplicationForm";

export interface SummaryData {
  total: number;
  toApply: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
  declined: number;
  ghosted: number;
  favorite: number;
  archived: number;
}

export interface Dashboard {
  summaryData: SummaryData
}

function createSummary(applications: ApplicationType[]): SummaryData {
  const totalSum: SummaryData = {
    total: applications.length,
    toApply: 0,
    applied: 0,
    interview: 0,
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
      case "Interview":
        totalSum.interview += 1;
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

export function createDashboard(applications: ApplicationType[]): Dashboard {
  return {
    summaryData: createSummary(applications)
  }
}