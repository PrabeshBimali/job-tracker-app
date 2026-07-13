import type { ApplicationType } from "../form/AddApplicationForm";
import ApplicationItem from "./ApplicationItem";

interface ApplicationListProps {
  applications: ApplicationType[];
}

export default function ApplicationsList({ applications }: ApplicationListProps) {
  return (
    <div className="border border-secondary-color bg-primary-color overflow-hidden">
      <table className="w-full border-collapse">
        <thead className="border-b border-secondary-color bg-background-color">
          <tr className="text-left text-text-color/80">
            <th className="w-3 md:w-10 px-5 py-4"></th>

            <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider">
              Company
            </th>

            <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
              Role
            </th>

            <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider">
              Status
            </th>

            <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
              Applied
            </th>

            <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">
              Next Action
            </th>

            <th className="w-14 px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider">
              ★
            </th>
          </tr>
        </thead>

        <tbody>
          {
            applications.map((v, k) => {
              return (
                <ApplicationItem
                  key={k}
                  application={v}
                />
              )
            })
          }
        </tbody>
      </table>
    </div>
  );
}