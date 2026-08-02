export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  
  const value = bytes / Math.pow(k, i);
  
  return `${value.toFixed(1)} ${sizes[i]}`;
}

export function uint8ArrayToBase64(data: Uint8Array): string {
  const binary = Array.from(data, byte =>
    String.fromCharCode(byte)
  ).join("");

  return btoa(binary);
}

export function base64ToUint8Array(data: string): Uint8Array {
  try {
    const binary = atob(data);

    const array = Array.from(binary, char =>
      char.charCodeAt(0)
    );

    return new Uint8Array(array);
  } catch {
    throw new Error("Backup file contains invalid encoded data.");
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}