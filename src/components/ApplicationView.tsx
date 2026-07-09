import { useSyncExternalStore } from "react";
import useLoadApplications from "../hooks/useLoadApplications";
import applicationsStore from "../store/applications.store";
import { ApplicationLoadingError, ApplicationNotFoundError } from "./ApplicationErrors";
import ApplicationFilter from "./ApplicationFilter";

export default function ApplicationView() {

  const { loading, error } = useLoadApplications();
  const applications = useSyncExternalStore(applicationsStore.subscribe, applicationsStore.getSnapshot);

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
      <ApplicationFilter/>
    </div>
  );
}