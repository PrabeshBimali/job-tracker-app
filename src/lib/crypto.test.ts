import { describe, it, expect } from "vitest";
import { generatePrivateKey, encryptData, decryptData } from "./crypto";

describe("generatePrivateKey", () => {
  it("should generate a key and salt", async () => {
    const result = await generatePrivateKey("password123");

    expect(result.key).toBeDefined();
    expect(result.salt).toBeDefined();
    expect(result.salt.length).toBe(16);
  });
});


describe("encrypt/decrypt", () => {
  it("should decrypt back to original data", async () => {
    const { key } = await generatePrivateKey("password123");

    const originalData = {
      name: "Andrew",
      age: 25
    };

    const { iv, ciphertext } = await encryptData(
      originalData,
      key
    );

    const decrypted = await decryptData(
      iv,
      ciphertext,
      key
    );

    expect(decrypted).toEqual(originalData);
  });
});

it("should generate different ciphertexts for same data", async () => {
  const { key } = await generatePrivateKey("password123");

  const data = { test: "hello" };

  const first = await encryptData(data, key);
  const second = await encryptData(data, key);

  expect(first.iv).not.toEqual(second.iv);

  expect(Array.from(new Uint8Array(first.ciphertext)))
    .not.toEqual(Array.from(new Uint8Array(second.ciphertext)));
});

it("should fail when using wrong key", async () => {
  const { key: key1 } = await generatePrivateKey("password1");
  const { key: key2 } = await generatePrivateKey("password2");

  const data = { secret: "bitcoin" };

  const encrypted = await encryptData(data, key1);

  await expect(
    decryptData(
      encrypted.iv,
      encrypted.ciphertext,
      key2
    )
  ).rejects.toThrow();
});

it("should fail when ciphertext is modified", async () => {
  const { key } = await generatePrivateKey("password123");

  const encrypted = await encryptData(
    { secret: "hello" },
    key
  );

  const tampered = new Uint8Array(encrypted.ciphertext);

  tampered[0] ^= 1;

  await expect(
    decryptData(
      encrypted.iv,
      tampered.buffer,
      key
    )
  ).rejects.toThrow();
});