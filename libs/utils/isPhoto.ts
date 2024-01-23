const PHOTO_FORMATS = ['.jpeg', '.jpg', '.png', '.webp'];

export const isPhoto = (filename: string): boolean =>
  PHOTO_FORMATS.some((format) => filename.endsWith(format));
