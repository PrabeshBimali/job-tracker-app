import type { ApplicationFilters } from "../components/applications/ApplicationView";
import type { SortOption } from "../components/applications/toolbar/SortDropdown";
import type { ApplicationType } from "../components/form/ApplicationForm";
import { decryptData, encryptData } from "./crypto";
import { deleteApplication, getApplicationById, insertApplication, setApplication, type DbApplication } from "./indexedDb";

async function encryptApplication(app: Omit<ApplicationType, "id" | "createdAt" | "updatedAt" | "favorite" | "archived">, key: CryptoKey): Promise<{ iv: Uint8Array; ciphertext: Uint8Array }> {
  const encryptedData = await encryptData(app, key);
  return encryptedData;
}

export async function decryptApplication(iv: Uint8Array, ciphertext: Uint8Array, key: CryptoKey): Promise<Omit<ApplicationType, "id" | "createdAt" | "updatedAt" | "favorite" | "archived">> {
  const decryptedData = await decryptData(iv, ciphertext, key);
  return decryptedData as Omit<ApplicationType, "id" | "createdAt" | "updatedAt">;
}

export async function decryptApplications(apps: DbApplication[], key: CryptoKey): Promise<Array<ApplicationType>> {
  let applicationPromises: Array<Promise<ApplicationType>> = [];

  applicationPromises = apps.map(async (app) => {
    const decryptedApp = await decryptApplication(app.iv, app.ciphertext, key);
    return {
      id: app.id,
      userId: app.userId,
      ...decryptedApp,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
      favorite: app.favorite,
      archived: app.archived
    };
  });

  return Promise.all(applicationPromises);
}

export async function decryptApplicationsInWorker(apps: DbApplication[], key: CryptoKey): Promise<Array<ApplicationType>> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./decrypt.worker.ts", import.meta.url), { type: "module" });

    worker.onmessage = (e) => {
      resolve(e.data);
      worker.terminate();
    };

    worker.onerror = (err) => {
      reject(err);
      worker.terminate();
    };
    
    worker.postMessage({ type: "applications_decrypt", payload: { dbApps: apps, key } });
  });
}

export async function addApplication(application: Omit<ApplicationType, "id" | "createdAt" | "updatedAt">, key: CryptoKey, userId: number): Promise<ApplicationType> {

  const { favorite, archived, ...cleanApplication } = application;
  const encryptedApp = await encryptApplication(cleanApplication, key);

  const dbApplication: Omit<DbApplication, "id" | "createdAt" | "updatedAt"> = {
    userId: userId,
    iv: encryptedApp.iv,
    ciphertext: encryptedApp.ciphertext,
    favorite: application.favorite,
    archived: application.archived
  }

  const applicationId = await insertApplication(dbApplication);
  
  const now = new Date().toISOString();
  return { ...application, "id": applicationId, "createdAt": now, "updatedAt": now };
}

export async function updateApplication(application: Omit<ApplicationType, "createdAt" | "updatedAt">, key: CryptoKey, userId: number): Promise<ApplicationType> {
  const dbApplication = await getApplicationById(application.id);

  if(!dbApplication || dbApplication.userId !== userId) {
    throw new Error(`Application with id: ${application.id} does not exists`);
  }

  const { id, favorite, archived,  ...cleanApplication } = application;
  const encryptedApp = await encryptApplication(cleanApplication, key);

  const newDbApplication: DbApplication = {
    id: dbApplication.id,
    userId: userId,
    iv: encryptedApp.iv,
    ciphertext: encryptedApp.ciphertext,
    favorite: application.favorite,
    archived: application.archived,
    createdAt: dbApplication.createdAt,
    updatedAt: dbApplication.updatedAt
  }

  await setApplication(newDbApplication);
  const now = new Date().toISOString();

  return { ...application, "updatedAt": now };
}

export async function toggleDbMetadata(appId: number, userId: number, field: "favorite" | "archived"): Promise<boolean> {
  const dbApplication = await getApplicationById(appId);

  if (!dbApplication || dbApplication.userId !== userId) {
    throw new Error(`Unauthorized or missing application: ${appId}`);
  }

  dbApplication[field] = !dbApplication[field];
  
  dbApplication.updatedAt = new Date().toISOString();

  await setApplication(dbApplication);

  return dbApplication[field];
}

export async function removeApplication(application: ApplicationType, userId: number): Promise<boolean> {
  const dbApplication = await getApplicationById(application.id);

  if(!dbApplication || dbApplication.userId !== userId) return false;

  await deleteApplication(application.id);
  return true;
}

export function getFilteredApplications(applications: ApplicationType[], filters: ApplicationFilters) {
  const searched = searchApplications(applications, filters.search);
  const filtered = filterApplications(searched, filters);
  return sortApplications(filtered, filters.sortBy);
}

function searchApplications(applications: ApplicationType[], search: string): ApplicationType[] {

  const term = search.trim().toLowerCase();

  if (!term) {
    return applications;
  }

  return applications.filter((application) => {
    return (
      application.company.toLowerCase().includes(term) ||
      application.role.toLowerCase().includes(term) ||
      application.location?.toLowerCase().includes(term) ||
      application.notes?.toLowerCase().includes(term)
    );
  });
}

export function filterApplications(applications: ApplicationType[], filters: ApplicationFilters): ApplicationType[] {

  return applications.filter((application) => {

    if (filters.statuses.length > 0 && !filters.statuses.includes(application.status)) return false;

    if (filters.workModes.length > 0 && !filters.workModes.includes(application.workMode)) return false;
    
    if (filters.workTypes.length > 0 && !filters.workTypes.includes(application.workType)) return false;
    
    if (filters.nextActions.length > 0 && !filters.nextActions.includes(application.nextAction)) return false;

    if (filters.favoriteOnly && !application.favorite) return false;

    if (!filters.includeArchived && application.archived) return false;

    return true;
  });
}

export function sortApplications(applications: ApplicationType[], sortBy: SortOption): ApplicationType[] {

  const sorted = [...applications];

  switch (sortBy) {
    case "Newest":
      sorted.sort(
        (a, b) =>
          new Date(b.dateApplied).getTime() -
          new Date(a.dateApplied).getTime()
      );
      break;

    case "Oldest":
      sorted.sort(
        (a, b) =>
          new Date(a.dateApplied).getTime() -
          new Date(b.dateApplied).getTime()
      );
      break;

    case "Company A-Z":
      sorted.sort((a, b) =>
        a.company.localeCompare(b.company)
      );
      break;

    case "Company Z-A":
      sorted.sort((a, b) =>
        b.company.localeCompare(a.company)
      );
      break;

    case "Status":
      sorted.sort((a, b) =>
        a.status.localeCompare(b.status)
      );
      break;

    //TODO: Add sort for Next Action 
  }

  return sorted;
}