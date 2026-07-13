import { useMemo, useSyncExternalStore } from "react";
import useLoadApplications from "../../hooks/useLoadApplications";
import applicationsStore from "../../store/applications.store";
import { ApplicationLoadingError, ApplicationNotFoundError } from "./ApplicationErrors";
import { getVisibleApplications } from "../../lib/applications";
import ApplicationsList from "./ApplicationList";

export default function ApplicationView() {

  const { loading, error } = useLoadApplications();
  const applications = useSyncExternalStore(applicationsStore.subscribe, applicationsStore.getSnapshot);

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
      />
    </div>
  );
}