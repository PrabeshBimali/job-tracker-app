import { describe, it, expect } from 'vitest';
import { formatFileSize, uint8ArrayToBase64, base64ToUint8Array } from './utilities';

describe('formatFileSize', () => {
  it('handles 0 bytes correctly', () => {
    expect(formatFileSize(0)).toBe('0 B');
  });

  it('formats standard byte sizes correctly', () => {
    expect(formatFileSize(500)).toBe('500.0 B');
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(1048576)).toBe('1.0 MB');
    expect(formatFileSize(1073741824)).toBe('1.0 GB');
  });

  it('handles negative bytes correctly', () => {
    expect(formatFileSize(-1024)).toBe('-1.0 KB');
  });

  it('handles sizes beyond PB gracefully', () => {
    const hugeBytes = Math.pow(1024, 6);
    expect(formatFileSize(hugeBytes)).toBe('1.0 undefined');
  });
});

describe('Base64 and Uint8Array conversions', () => {
  it('converts Uint8Array to base64 string', () => {
    const input = new Uint8Array([72, 101, 108, 108, 111]);
    const result = uint8ArrayToBase64(input);
    expect(result).toBe('SGVsbG8=');
  });

  it('converts base64 string back to Uint8Array', () => {
    const input = 'SGVsbG8=';
    const result = base64ToUint8Array(input);
    expect(result).toEqual(new Uint8Array([72, 101, 108, 108, 111]));
  });

  it('performs a successful roundtrip conversion', () => {
    const originalBytes = new Uint8Array([0, 1, 127, 255, 64, 128]);
    
    const base64 = uint8ArrayToBase64(originalBytes);
    const roundtripBytes = base64ToUint8Array(base64);

    expect(roundtripBytes).toEqual(originalBytes);
  });

  it('handles empty inputs correctly', () => {
    const emptyArray = new Uint8Array([]);
    const base64 = uint8ArrayToBase64(emptyArray);
    
    expect(base64).toBe('');
    expect(base64ToUint8Array('')).toEqual(new Uint8Array([]));
  });
});