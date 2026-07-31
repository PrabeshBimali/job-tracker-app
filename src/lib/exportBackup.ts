import { getApplicationsByUser, getUserById, type DbApplication, type DbUser } from "./indexedDb";
import { uint8ArrayToBase64 } from "./utilities";

export interface BackupApplication {
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
    username: string;
    salt: string;
    passwordVerifier: string;
    verifierIv: string;
    createdAt: string;
    updatedAt: string;
  };

  applications: BackupApplication[];
}


function createBackup(dbApplications: DbApplication[], user: DbUser) {
  const cleanApplications: BackupApplication[] = dbApplications.map((app) => {
    return {
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
      username: user.username,
      salt: uint8ArrayToBase64(user.salt),
      passwordVerifier: uint8ArrayToBase64(user.passwordVerifier),
      verifierIv: uint8ArrayToBase64(user.verifierIv),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
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

export default async function exportBackup(userId: number) {
  const user = await getUserById(userId);
  if(!user) throw new Error("User not found in Database");

  const dbApplications = await getApplicationsByUser(userId);
  if(dbApplications.length <= 0) throw new Error("No Applications Found!");

  const blob = createBackup(dbApplications, user);
  const date = new Date().toISOString().slice(0, 10);
  const filename = `jobtrack-backup-${date}.json`;
  downloadBackup(blob, filename);
}


