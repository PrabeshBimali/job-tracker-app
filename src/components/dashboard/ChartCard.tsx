import { BarChart } from "lucide-react";
import SummaryBarChart, { type BarChartItem } from "./SummaryBarChart";
import { useState } from "react";
import CarouselSwitcher from "../common/CarouseSwitcher";

interface StatusChartCardProps {
  statusChartData: BarChartItem[];
  nextActionChartData: BarChartItem[];
  workModeChartData: BarChartItem[];
  workTypeChartData: BarChartItem[];
}

const CHART_OPTIONS = [ "Status", "Work Mode", "Work Type", "Next Action" ] as const;

export default function StatusChartCard( 
  { 
    statusChartData, 
    nextActionChartData,
    workModeChartData,
    workTypeChartData
  } : StatusChartCardProps ) {

  const [chartIndex, setChartIndex] = useState(0);

  const chartData = {
    "Status": statusChartData,
    "Work Mode": workModeChartData,
    "Work Type": workTypeChartData,
    "Next Action": nextActionChartData
  }[CHART_OPTIONS[chartIndex]]

  return (
    <div className="border border-secondary-color bg-primary-color p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart
            size={20}
            className="text-accent-color"
          />

          <h2 className="text-md font-semibold text-text-color">
            Distribution
          </h2>
        </div>

        <CarouselSwitcher
          items={CHART_OPTIONS}
          selected={chartIndex}
          onChange={setChartIndex}
        />

      </div>

      <div className="flex items-center justify-center h-56">
        <SummaryBarChart
          chartData={chartData}
        />
      </div>
    </div>
  );
}