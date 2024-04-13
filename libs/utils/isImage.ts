const IMAGE_FORMATS = ['.jpeg', '.jpg', '.png', '.webp'];

export const isImage = (filename: string): boolean =>
  IMAGE_FORMATS.some((format) => filename.endsWith(format));
