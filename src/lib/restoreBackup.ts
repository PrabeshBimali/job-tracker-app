import type { BackupFile } from "./exportBackup";
import type { DbApplication } from "./indexedDb";
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

  if (!Array.isArray(backup.applications))
    throw new Error("Invalid backup.");

  if(!backup.user)
    throw new Error("Invalid backup");  

  if (!backup.user?.salt)
    throw new Error("Missing encryption salt.");

  return backup as BackupFile;
}

export function createBackupPreview(backup: BackupFile): BackupPreview {
  return {
    username: backup.user.username,
    applicationCount: backup.applications.length,
    createdAt: backup.createdAt
  }
}

function deserilizeBackup(backup: BackupFile, userId: number): { salt: Uint8Array, dbApplications: DbApplication[] } {
  const salt = base64ToUint8Array(backup.user.salt);

  const dbApplications: DbApplication[] = backup.applications.map((app) => {
    return {
      id: app.id,
      userId: userId,
      ciphertext: base64ToUint8Array(app.ciphertext),
      iv: base64ToUint8Array(app.iv),
      favorite: app.favorite,
      archived: app.archived,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt
    }
  });

  return { salt, dbApplications }
}

export default async function restoreBackup(backup: BackupFile, userId: number) {
  const { salt, dbApplications } = deserilizeBackup(backup, userId);
  console.log(salt);
  console.log(dbApplications);
}