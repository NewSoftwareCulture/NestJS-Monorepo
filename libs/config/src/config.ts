import { resolve } from 'path';
import { readFileSync } from 'fs';

import { fileExistsSync } from 'libs/utils';

import { ConfigDto } from './config.dto';
import { CONFIG_FILE_PATH } from './constants';
import { validateConfig } from './helpers/validateConfig';

export const getConfigRelativePath = () =>
  CONFIG_FILE_PATH[process.env.NODE_ENV] || CONFIG_FILE_PATH.default;

export const getConfig = (): ConfigDto => {
  const configPath = resolve(__dirname, getConfigRelativePath());

  const isExists = fileExistsSync(configPath);

  if (!isExists) throw new Error(`!config [path: ${configPath}]`);

  const config = JSON.parse(readFileSync(configPath, { encoding: 'utf-8' }));

  return validateConfig(config);
};
