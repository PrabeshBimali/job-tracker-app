import { useMemo, useState, useSyncExternalStore } from "react";
import useLoadApplications from "../../hooks/useLoadApplications";
import applicationsStore from "../../store/applications.store";
import { ApplicationLoadingError, ApplicationNotFoundError } from "./ApplicationErrors";
import { getVisibleApplications, removeApplication, toggleDbMetadata } from "../../lib/applications";
import ApplicationsList from "./ApplicationList";
import type { ApplicationType, JobStatus, WorkMode, WorkType } from "../form/ApplicationForm";
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
  sortBy: SortOption;
}

export default function ApplicationView() {

  const { loading, error } = useLoadApplications();
  const applications = useSyncExternalStore(applicationsStore.subscribe, applicationsStore.getSnapshot);
  const { user, key: cryptoKey } = useAuth();
  const navigate = useNavigate();

  const [ deletingApplication, setDeletingApplication ] = useState<ApplicationType | null>(null);

  const [ page, setPage ] = useState<number>(1);
  const [ pageSize, setPageSize ] = useState<number>(10);
  const [ totalPages, setTotalPages ] = useState<number>(50);

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

  const visibleApplications = useMemo(() => {
    console.log(applications)
    return getVisibleApplications(applications);
  }, [applications])

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

      <ApplicationToolbar/>

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