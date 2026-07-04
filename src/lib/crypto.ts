import { argon2id } from "hash-wasm";

const MEMORY_SIZE = 65536; // 64mb memory for argon2id

export async function generatePrivateKey(password: string, salt?: Uint8Array): Promise<{key: CryptoKey, salt: Uint8Array}> {

  salt = salt || crypto.getRandomValues(new Uint8Array(16));

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


export async function encryptData(data: Object, key: CryptoKey): Promise<{ iv: Uint8Array; ciphertext: Uint8Array }> {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(JSON.stringify(data));

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const buffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    encodedData
  );

  return { iv,  ciphertext: new Uint8Array(buffer) };
}

export async function decryptData(iv: Uint8Array, ciphertext: Uint8Array, key: CryptoKey): Promise<Object> {
  const decryptedData = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv.buffer as ArrayBuffer
    },
    key,
    ciphertext.buffer as ArrayBuffer
  );

  const decoder = new TextDecoder();
  const decodedData = decoder.decode(decryptedData);

  return JSON.parse(decodedData);
}