import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import useLoadApplications from "../../hooks/useLoadApplications";
import applicationsStore from "../../store/applications.store";
import { ApplicationLoadingError, ApplicationNotFoundError } from "./ApplicationErrors";
import { getFilteredApplications, removeApplication, toggleDbMetadata } from "../../lib/applications";
import ApplicationsList from "./ApplicationList";
import type { ApplicationType, JobStatus, NextAction, WorkMode, WorkType } from "../form/ApplicationForm";
import DeleteApplicationPopup from "../form/DeleteApplicationPopup";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";
import ApplicationToolbar from "./toolbar/ApplicationToolbar";
import Pagination from "./Pagination";
import type { SortOption } from "./toolbar/SortDropdown";

export interface ApplicationFilters {
  search: string;
  statuses: JobStatus[];
  workModes: WorkMode[];
  workTypes: WorkType[];
  nextActions: NextAction[];
  sortBy: SortOption;
  favoriteOnly: boolean;
  includeArchived: boolean;
}

export default function ApplicationView() {

  const { loading, error } = useLoadApplications();
  const applications = useSyncExternalStore(applicationsStore.subscribe, applicationsStore.getSnapshot);
  const { user, key: cryptoKey } = useAuth();
  const navigate = useNavigate();

  const [ deletingApplication, setDeletingApplication ] = useState<ApplicationType | null>(null);

  const [ filters, setFilters ] = useState<ApplicationFilters>({
    search: "",
    statuses: [],
    workModes: [],
    workTypes: [],
    nextActions: [],
    sortBy: "Newest",
    favoriteOnly: false,
    includeArchived: false
  })

  const [ page, setPage ] = useState<number>(1);
  const [ pageSize, setPageSize ] = useState<number>(10);

  async function onDelete() {
    try {
      if(!cryptoKey || !user) {
        navigate("/login");
        throw new Error("User not logged in!");
      }

      if(!deletingApplication) return;

      await removeApplication(deletingApplication, user.id);
      applicationsStore.deleteApplication(deletingApplication.id);

    } catch(error) {
      //TODO: Add toast to show generic error
      console.error(error)
    } finally {
      setDeletingApplication(null);
    }
  }

  async function onToggleMetadata(application: ApplicationType, field: "favorite" | "archived") {
    try {
      if(!cryptoKey || !user) {
        navigate("/login");
        throw new Error("User not logged in!");
      }

      await toggleDbMetadata(application.id, user.id, field);
      
      if(field === "favorite") {
        applicationsStore.toggleFavorite(application.id);
        return;
      }

      applicationsStore.toggleArchive(application.id);
      
    } catch(error) {
      //TODO: Add toast to show generic error
      console.error(error)
    }
  }

  function updateFilter<K extends keyof ApplicationFilters>( key: K, value: ApplicationFilters[K] ) {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }


  const filteredApplications = useMemo(() => {
    return getFilteredApplications(applications, filters);
  }, [applications, filters]);

  const totalPages = Math.ceil(filteredApplications.length / pageSize);

  const visibleApplications = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredApplications.slice(start, start + pageSize);
  }, [filteredApplications, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [filters, pageSize]);

  if(loading) {
    //TODO: Add Skeleton Loader
    return <p>Loading applications...</p>;
  }

  if(error) {
    return <ApplicationLoadingError error={error} />;
  }

  if(applications.length === 0) {
    return <ApplicationNotFoundError/>;
  }

  return (
    <div>

      <ApplicationToolbar
        selectedStatuses={filters.statuses}
        search={filters.search}
        sortBy={filters.sortBy}
        workModes={filters.workModes}
        workTypes={filters.workTypes}
        nextActions={filters.nextActions}
        favoriteOnly={filters.favoriteOnly}
        includeArchived={filters.includeArchived}
        updateFilter={updateFilter}
      />

      <ApplicationsList
        applications={visibleApplications}
        onDelete={setDeletingApplication}
        onToggleMetadata={onToggleMetadata}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageChange={(page) => setPage(page)}
        onPageSizeChange={(pageSize) => setPageSize(pageSize)}
      />

      <DeleteApplicationPopup
        application={deletingApplication}
        onClose={() => setDeletingApplication(null)}
        onDelete={onDelete}
      />
    </div>
  );
}