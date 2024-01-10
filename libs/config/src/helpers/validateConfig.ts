import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { ConfigDto } from '../config.dto';

export function validateConfig(config: ConfigDto): ConfigDto {
  const validatedConfig = plainToInstance(ConfigDto, config, {
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
