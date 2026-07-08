import { decryptApplications } from "./applications";

self.onmessage = async (e) => {
  if(e.data.type !== "applications_decrypt") return;
  const { dbApps, key } = e.data.payload

  const result = await decryptApplications(dbApps, key)

  self.postMessage(result)
}