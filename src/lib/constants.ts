import type { SortOption } from "../components/applications/toolbar/SortDropdown";
import type { JobStatus, NextAction, WorkMode, WorkType } from "../components/form/ApplicationForm";

export const JOB_STATUSES: JobStatus[] = [
  "To Apply",
  "Applied",
  "In Progress",
  "Rejected",
  "Offer",
  "Declined",
  "Ghosted"
];

export const NEXT_ACTIONS: NextAction[] = [
  "None",
  "Follow Up",
  "Interview",
  "Assessment",
];

export const WORK_MODES: WorkMode[] = [
  "Remote",
  "Hybrid",
  "On-site",
];

export const WORK_TYPES: WorkType[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
];

export const SORT_OPTIONS: SortOption[] = [
  "Newest",
  "Oldest",
  "Company A-Z",
  "Company Z-A",
  "Status",
  "Next Action"
]