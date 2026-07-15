import { useMemo, useState, useSyncExternalStore } from "react";
import useLoadApplications from "../../hooks/useLoadApplications";
import applicationsStore from "../../store/applications.store";
import { ApplicationLoadingError, ApplicationNotFoundError } from "./ApplicationErrors";
import { getVisibleApplications, removeApplication, toggleDbMetadata } from "../../lib/applications";
import ApplicationsList from "./ApplicationList";
import type { ApplicationType } from "../form/AddApplicationForm";
import DeleteApplicationPopup from "../form/DeleteApplicationPopup";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router";

export default function ApplicationView() {

  const { loading, error } = useLoadApplications();
  const applications = useSyncExternalStore(applicationsStore.subscribe, applicationsStore.getSnapshot);
  const { user, key: cryptoKey } = useAuth();
  const navigate = useNavigate();

  const [ deletingApplication, setDeletingApplication ] = useState<ApplicationType | null>(null);

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
      <ApplicationsList
        applications={visibleApplications}
        onDelete={setDeletingApplication}
        onToggleMetadata={onToggleMetadata}
      />

      <DeleteApplicationPopup
        application={deletingApplication}
        onClose={() => setDeletingApplication(null)}
        onDelete={onDelete}
      />
    </div>
  );
}