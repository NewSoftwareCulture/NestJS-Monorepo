export const CONFIG_FILE_PATH_GLOBAL = {
  default: '../../../../config.json',
  local: '../../../../config.local.json',
  develop: '../../../../config.dev.json',
  production: '../../../../config.prod.json',
};

export const CONFIG_FILE_PATH_LOCAL = {
  default: 'config.json',
  local: 'config.local.json',
  develop: 'config.dev.json',
  production: 'config.prod.json',
};

export const CONFIG_SERVICE_DI = Symbol('CONFIG_SERVICE_DI');
