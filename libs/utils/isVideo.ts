const VIDEO_FORMATS = ['.mp4', '.avi', '.webm'];

export const isVideo = (filename: string): boolean =>
  VIDEO_FORMATS.some((format) => filename.endsWith(format));
