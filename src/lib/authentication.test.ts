import { describe, it, expect } from "vitest";
import { generatePrivateKey } from "./crypto";
import { generatePasswordVerifier, verifyPassword } from "./authentication";


describe("Authentication", () => {
  it("should generate a password verifier", async () => {
    const { key } = await generatePrivateKey("password123");

  const verifier = await generatePasswordVerifier(key);

    expect(verifier.iv).toBeDefined();
    expect(verifier.iv.length).toBe(12);
    expect(verifier.ciphertext.byteLength).toBeGreaterThan(0);
  });

  it("should verify the correct password", async () => {
    const password = "password123";

    const { key, salt } = await generatePrivateKey(password);

    const verifier = await generatePasswordVerifier(key);

    const { key: loginKey } = await generatePrivateKey(
      password,
      salt
    );

    const verified = await verifyPassword(
      loginKey,
      verifier.iv,
      verifier.ciphertext
    );

    expect(verified).toBe(true);
  });

  it("should reject an incorrect password", async () => {
    const { key } = await generatePrivateKey("password123");

    const verifier = await generatePasswordVerifier(key);

    const { key: wrongKey } = await generatePrivateKey("wrong-password");

    const verified = await verifyPassword(
      wrongKey,
      verifier.iv,
      verifier.ciphertext
    );

    expect(verified).toBe(false);
  });

  it("should reject the same password with a different salt", async () => {
    const password = "password123";

    const { key } = await generatePrivateKey(password);

    const verifier = await generatePasswordVerifier(key);

    const differentSalt = crypto.getRandomValues(
      new Uint8Array(16)
    );

    const { key: wrongKey } = await generatePrivateKey(
      password,
      differentSalt
    );

    const verified = await verifyPassword(
      wrongKey,
      verifier.iv,
      verifier.ciphertext
    );

    expect(verified).toBe(false);
  });

  it("should reject a tampered password verifier", async () => {
    const { key } = await generatePrivateKey("password123");

    const verifier = await generatePasswordVerifier(key);

    const tampered = verifier.ciphertext;;

    tampered[0] ^= 1;

    const verified = await verifyPassword(
      key,
      verifier.iv,
      tampered
    );

    expect(verified).toBe(false);
  });

  it("should reject a tampered IV", async () => {
    const { key } = await generatePrivateKey("password123");

    const verifier = await generatePasswordVerifier(key);

    const tamperedIv = new Uint8Array(verifier.iv);

    tamperedIv[0] ^= 1;

    const verified = await verifyPassword(
      key,
      tamperedIv,
      verifier.ciphertext
    );

    expect(verified).toBe(false);
  });
});