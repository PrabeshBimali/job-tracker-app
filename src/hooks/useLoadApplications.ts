import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { getApplicationsByUser } from "../lib/indexedDb";
import { decryptApplicationsInWorker } from "../lib/applications";
import applicationsStore from "../store/applications.store";

export default function useLoadApplications(): {loading: boolean, error: Error | null} {
  const { user, key } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadApplications() {
      if(applicationsStore.getSnapshot().length > 0) return;
      if (!user || !key) return;
      setLoading(true);

      try {
        const dbApps = await getApplicationsByUser(user.id);

        const apps = await decryptApplicationsInWorker(
          dbApps,
          key
        );

        applicationsStore.setApplications(apps);
      } catch (error) {
        setError(error as Error);
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, [user, key]);

  return { loading, error };
}