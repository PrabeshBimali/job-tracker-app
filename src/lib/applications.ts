import type { ApplicationType } from "../components/form/AddApplicationForm";
import { decryptData, encryptData } from "./crypto";
import { deleteApplication, getApplicationById, insertApplication, setApplication, type DbApplication } from "./indexedDb";

async function encryptApplication(app: Omit<ApplicationType, "id" | "createdAt" | "updatedAt" | "favorite" | "archived">, key: CryptoKey): Promise<{ iv: Uint8Array; ciphertext: Uint8Array }> {
  const encryptedData = await encryptData(app, key);
  return encryptedData;
}

export async function decryptApplication(iv: Uint8Array, ciphertext: Uint8Array, key: CryptoKey): Promise<Omit<ApplicationType, "id" | "createdAt" | "updatedAt">> {
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
      updatedAt: app.updatedAt
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

export function getVisibleApplications(applications: ApplicationType[]): ApplicationType[] {
  return applications;
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

export async function updateApplication(application: ApplicationType, key: CryptoKey, userId: number): Promise<ApplicationType> {
  const dbApplication = await getApplicationById(application.id);

  if(!dbApplication || dbApplication.userId !== userId) {
    throw new Error(`Application with id: ${application.id} does not exists`);
  }

  const { id, createdAt, updatedAt, favorite, archived,  ...cleanApplication } = application;
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