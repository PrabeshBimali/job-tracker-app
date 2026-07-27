import type { DbApplication } from "./indexedDb";

export interface BackupApplication {
  id: number;
  iv: string;
  ciphertext: string;
  favorite: boolean;
  archived: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackupFile {
  backupVersion: 1;
  createdAt: string;

  user: {
    salt: string;
  };

  applications: BackupApplication[];
}

function uint8ArrayToBase64(data: Uint8Array): string {
  const binary = Array.from(data, byte =>
    String.fromCharCode(byte)
  ).join("");

  return btoa(binary);
}

function createBackup(dbApplications: DbApplication[], salt: Uint8Array) {
  const cleanApplications: BackupApplication[] = dbApplications.map((app) => {
    return {
      id: app.id,
      iv: uint8ArrayToBase64(app.iv),
      ciphertext: uint8ArrayToBase64(app.ciphertext),
      favorite: app.favorite,
      archived: app.archived,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt
    }
  });
  
  const now = new Date().toISOString();

  const backup: BackupFile = {
    backupVersion: 1,
    createdAt: now,
    user: {
      salt: uint8ArrayToBase64(salt)
    },
    applications: cleanApplications
  };

  const bckupString = JSON.stringify(backup);
  return new Blob([bckupString], { type: "application/json" });
}

function downloadBackup(blob: Blob, filename: string) {
  const downloadUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(downloadUrl);
}

export default function exportBackup(dbApplications: DbApplication[], salt: Uint8Array) {
  const blob = createBackup(dbApplications, salt);
  const date = new Date().toISOString().slice(0, 10);
  const filename = `jobtrack-backup-${date}.json`;
  downloadBackup(blob, filename);
}


