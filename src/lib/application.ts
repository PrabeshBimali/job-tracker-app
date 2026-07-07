import type { ApplicationType } from "../components/AddApplicationForm";
import { decryptData, encryptData } from "./crypto";

export async function encryptApplication(app: Omit<ApplicationType, "id" | "createdAt" | "updatedAt">, key: CryptoKey): Promise<{ iv: Uint8Array; ciphertext: Uint8Array }> {
  const encryptedData = await encryptData(app, key);
  return encryptedData;
}

export async function decryptApplication(iv: Uint8Array, ciphertext: Uint8Array, key: CryptoKey): Promise<Omit<ApplicationType, "id" | "createdAt" | "updatedAt">> {
  const decryptedData = await decryptData(iv, ciphertext, key);
  return decryptedData as Omit<ApplicationType, "id" | "createdAt" | "updatedAt">;
}