import { argon2id } from "hash-wasm";

export interface PrivateKeyData {
  key: CryptoKey;
  salt: Uint8Array;
}

const MEMORY_SIZE = 65536; // 64mb memory for argon2id

export async function generatePrivateKey(password: string): Promise<PrivateKeyData> {

  const salt = crypto.getRandomValues(new Uint8Array(16));

  const rawKey = await argon2id({
    password: password,
    salt: salt,
    parallelism: 1,
    iterations: 3,
    memorySize: MEMORY_SIZE,
    hashLength: 32, // output size = 32 bytes
    outputType: "binary"
  });

  const cryptoKey = await crypto.subtle.importKey(
    "raw", 
    rawKey.buffer as ArrayBuffer, 
    "AES-GCM", 
    false, 
    ["encrypt", "decrypt"]
  );

  return {
    key: cryptoKey,
    salt
  };
}


export async function encryptData(data: Object, key: CryptoKey): Promise<{ iv: Uint8Array; ciphertext: ArrayBuffer }> {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(JSON.stringify(data));

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    encodedData
  );

  return { iv, ciphertext };
}

export async function decryptData(iv: Uint8Array, ciphertext: ArrayBuffer, key: CryptoKey): Promise<Object> {
  const decryptedData = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv.buffer as ArrayBuffer
    },
    key,
    ciphertext
  );

  const decoder = new TextDecoder();
  const decodedData = decoder.decode(decryptedData);

  return JSON.parse(decodedData);
}