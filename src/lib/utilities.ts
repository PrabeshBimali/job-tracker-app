export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  
  const value = bytes / Math.pow(k, i);
  
  return `${value.toFixed(1)} ${sizes[i]}`;
}