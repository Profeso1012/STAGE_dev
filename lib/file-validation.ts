export const SUPPORTED_MIME_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  text: ['text/plain', 'text/markdown', 'application/pdf'],
};

export const UNSUPPORTED_CATEGORIES = {
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/aac'],
  video: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'],
};

export type FileCategory = 'image' | 'text' | 'audio' | 'video' | 'unknown';

export function getFileCategory(file: File): FileCategory {
  const mimeType = file.type;

  // Check supported types
  if (SUPPORTED_MIME_TYPES.images.includes(mimeType)) return 'image';
  if (SUPPORTED_MIME_TYPES.text.includes(mimeType)) return 'text';

  // Check unsupported types
  if (UNSUPPORTED_CATEGORIES.audio.some(type => mimeType.startsWith('audio'))) return 'audio';
  if (UNSUPPORTED_CATEGORIES.video.some(type => mimeType.startsWith('video'))) return 'video';

  return 'unknown';
}

export function isFileSupported(file: File): boolean {
  const category = getFileCategory(file);
  return category === 'image' || category === 'text';
}

export function getSupportedFileTypes(): string {
  return 'Images (JPEG, PNG, GIF, WebP, SVG) and Text files (TXT, MD, PDF)';
}
