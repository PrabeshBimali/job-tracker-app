import { useSyncExternalStore } from "react";
import NextActionsCard from "./NextActionsCard";
import StatusChartCard from "./StatusChartCard";
import SummaryRow from "./SummaryRow";
import applicationsStore from "../../store/applications.store";
import { createDashboard } from "../../lib/dashboard";

export default function Dashboard() {
  
  const applications = useSyncExternalStore(applicationsStore.subscribe, applicationsStore.getSnapshot);

  const dashboard = createDashboard(applications);

  return (
    <div className="flex flex-col gap-4">
      <SummaryRow summaryData={dashboard.summaryData}  />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <NextActionsCard/>
        <StatusChartCard/>
      </div>
    </div>
  );
}