import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getApplicationsByUser } from "../lib/indexedDb";
import { decryptApplicationsInWorker } from "../lib/applications";

export default function ApplicationsView() {

  const { user, key } = useAuth();

  useEffect(() => {
    async function fetchApplications() {
      if(!key || !user) return;
      const dbApps = await getApplicationsByUser(user.id);
      const apps = await decryptApplicationsInWorker(dbApps, key);
      console.log(apps);
    }
    fetchApplications();
  }, []);

  return (
    <>
    </>
  );
}