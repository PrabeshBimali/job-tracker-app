export interface BarChartItem {
  label: string;
  value: number;
}

interface SummaryBarChartProps {
  chartData: BarChartItem[]
}

export default function SummaryBarChart( { chartData } : SummaryBarChartProps) {
  

  const max = Math.max(...chartData.map((item) => item.value));

  return (
    <div className="flex h-full w-full flex-col justify-center gap-5">
      {chartData.map((item) => (
        <div
          key={item.label}
          className="grid grid-cols-[90px_1fr_32px] items-center gap-3"
        >
          <span className="text-sm text-text-color">
            {item.label}
          </span>

          <div className="h-3 w-full bg-secondary-color">
            <div
              className="h-full bg-accent-color transition-all duration-500"
              style={{
                width: `${(item.value / max) * 100}%`,
              }}
            />
          </div>

          <span className="text-right text-sm font-semibold text-text-color">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}