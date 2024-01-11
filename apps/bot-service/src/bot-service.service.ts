import { Injectable } from '@nestjs/common';
import { ConfigService } from '@libs/config';
import { LoggerService } from '@libs/logger';

@Injectable()
export class BotService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}
}
