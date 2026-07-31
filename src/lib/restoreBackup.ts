import { verifyPassword } from "./authentication";
import { generatePrivateKey } from "./crypto";
import type { BackupApplication, BackupFile } from "./exportBackup";
import { getUserByUsername, type DbApplication, type DbUser } from "./indexedDb";
import { base64ToUint8Array } from "./utilities";

export interface BackupPreview {
    username: string;
    applicationCount: number;
    createdAt: string;
}

export function parseBackup(text: string): BackupFile {
  const backup = JSON.parse(text);

  if (typeof backup !== "object" || backup === null)
    throw new Error("Invalid backup.");

  if (backup.backupVersion !== 1)
    throw new Error("Unsupported backup version.");

  if (typeof backup.createdAt !== "string")
    throw new Error("Invalid backup.");

  if (typeof backup.user !== "object" || backup.user === null)
    throw new Error("Invalid backup.");

  if (!Array.isArray(backup.applications))
    throw new Error("Invalid backup.");

  validateUser(backup.user);
  validateApplications(backup.applications);

  return backup as BackupFile;
}

function validateUser(user: BackupFile["user"]) {
  if (typeof user.username !== "string")
    throw new Error("Invalid backup.");

  if (typeof user.createdAt !== "string")
    throw new Error("Invalid backup.");

  if (typeof user.updatedAt !== "string")
    throw new Error("Invalid backup.");

  if (typeof user.salt !== "string")
    throw new Error("Invalid backup.");

  if (typeof user.passwordVerifier !== "string")
    throw new Error("Invalid backup.");

  if (typeof user.verifierIv !== "string")
    throw new Error("Invalid backup.");
}

function validateApplications(applications: BackupApplication[]) {
  for (const app of applications) {
    if (typeof app.favorite !== "boolean")
      throw new Error("Invalid backup.");

    if (typeof app.archived !== "boolean")
      throw new Error("Invalid backup.");

    if (
      app.createdAt !== undefined &&
      typeof app.createdAt !== "string"
    )
      throw new Error("Invalid backup.");

    if (
      app.updatedAt !== undefined &&
      typeof app.updatedAt !== "string"
    )
      throw new Error("Invalid backup.");

    if (typeof app.iv !== "string")
      throw new Error("Invalid backup.");

    if (typeof app.ciphertext !== "string")
      throw new Error("Invalid backup.");
  }
}

export function createBackupPreview(backup: BackupFile): BackupPreview {
  return {
    username: backup.user.username,
    applicationCount: backup.applications.length,
    createdAt: backup.createdAt
  }
}

export function deserilizeBackup(backup: BackupFile): { user: Omit<DbUser, "id">, dbApplications: Omit<DbApplication, "id" | "userId">[] } {

  const user: Omit<DbUser, "id"> = {
    username: backup.user.username,
    salt: base64ToUint8Array(backup.user.salt),
    passwordVerifier: base64ToUint8Array(backup.user.passwordVerifier),
    verifierIv: base64ToUint8Array(backup.user.verifierIv),
    createdAt: backup.user.createdAt,
    updatedAt: backup.user.updatedAt
  } satisfies Omit<DbUser, "id">

  const dbApplications: Omit<DbApplication, "id" | "userId">[] = backup.applications.map((app) => {
    return {
      ciphertext: base64ToUint8Array(app.ciphertext),
      iv: base64ToUint8Array(app.iv),
      favorite: app.favorite,
      archived: app.archived,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt
    } satisfies Omit<DbApplication, "id" | "userId">
  });

  return { user, dbApplications }
}

export async function verifyBackupPassword(password: string, user: Omit<DbUser, "id">): Promise<CryptoKey | null> {
  const { key } = await generatePrivateKey(password, user.salt);

  const isValid = await verifyPassword(key, user.verifierIv, user.passwordVerifier);

  return isValid ? key : null;
}

export async function usernameExists(username: string): Promise<boolean> {
  const user = await getUserByUsername(username);

  if(user) return true;

  return false;
}
