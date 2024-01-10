import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

import { getConfig } from './config';

@Injectable()
export class ConfigService extends NestConfigService<
  ReturnType<typeof getConfig>
> {}
