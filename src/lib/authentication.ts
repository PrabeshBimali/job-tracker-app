export async function generatePasswordVerifier(key: CryptoKey): Promise<{ iv: Uint8Array; ciphertext: Uint8Array }> {
  const data = crypto.getRandomValues(new Uint8Array(32));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    key,
    data
  );

  return { iv, ciphertext: new Uint8Array(ciphertext) };
}

export async function verifyPassword(key: CryptoKey, iv: Uint8Array, passwordVerifier: Uint8Array): Promise<boolean> {
  try {
    await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv.buffer as ArrayBuffer
      },
      key,
      passwordVerifier.buffer as ArrayBuffer
    );

    return true;
  } catch (error) {
    return false;
  }
}