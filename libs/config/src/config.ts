/* eslint-disable prettier/prettier */
import { resolve } from 'path';
import { readFileSync } from 'fs';

import { fileExistsSync } from '@libs/utils';

import { ConfigDto } from './dto/config.dto';
import { CONFIG_FILE_PATH_LOCAL, CONFIG_FILE_PATH_GLOBAL } from './constants';
import { validateConfig } from './helpers/validateConfig';

export const getFileConfig = () => {
  let configPath = '';

  const localFile = resolve(
    __dirname,
    CONFIG_FILE_PATH_LOCAL[process.env.NODE_ENV] ||
      CONFIG_FILE_PATH_LOCAL.default,
  );
  const globalFile = resolve(
    __dirname,
    CONFIG_FILE_PATH_GLOBAL[process.env.NODE_ENV] ||
      CONFIG_FILE_PATH_GLOBAL.default,
  );

  if (fileExistsSync(localFile)) configPath = localFile;
  if (fileExistsSync(globalFile)) configPath = globalFile;

  if (!configPath) return {};

  return JSON.parse(readFileSync(configPath, { encoding: 'utf-8' }));
};

export const getDockerConfig = () => {
  if (!process.env.CONFIG) return {};

  return JSON.parse(process.env.CONFIG);
};

const setEnvVariables = (config): ConfigDto => {
  if (process.env.PORT) config.port = process.env.PORT;

  if (process.env.SERVICE_NAME) config.logger.label = process.env.SERVICE_NAME;

  if (process.env.RABBITMQ_QUEUE) config.transport.rabbit.queue = process.env.RABBITMQ_QUEUE;
  if (process.env.RABBITMQ_PREFETCH) config.transport.rabbit.prefetchCount = process.env.RABBITMQ_PREFETCH;
  return config;
};

export const getConfig = (): ConfigDto => {
  const fileConfig = getFileConfig();
  const dockerConfig = getDockerConfig();

  const config = Object.assign({}, dockerConfig, fileConfig);

  if (JSON.stringify(config) === '{}') throw new Error('!config');

  return validateConfig(setEnvVariables(config));
};
