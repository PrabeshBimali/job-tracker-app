import { CalendarClock } from "lucide-react";

export default function NextActionsCard() {
  return (
    <div className="border border-secondary-color bg-primary-color p-5">
      <div className="flex items-center gap-2 mb-4">
        <CalendarClock
          size={20}
          className="text-accent-color"
        />

        <h2 className="text-lg font-semibold text-text-color">
          Next Actions
        </h2>
      </div>

      <div className="flex items-center justify-center py-10">
        <p className="text-sm text-text-color/60">
          No upcoming actions.
        </p>
      </div>
    </div>
  );
}