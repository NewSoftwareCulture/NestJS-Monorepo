import { promises as fs, existsSync, constants } from 'fs';

export const fileExists = async (path: string): Promise<boolean> => {
  return fs
    .access(path, constants.F_OK)
    .then(() => true)
    .catch(() => false);
};

export const fileExistsSync = (path): boolean => {
  return existsSync(path);
};

