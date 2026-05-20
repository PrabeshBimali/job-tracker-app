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
