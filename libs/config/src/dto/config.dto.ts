import { Expose, Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';

import { BotConfig } from './bot.dto';
import { LoggerConfig } from './logger.dto';

export class ConfigDto {
  @Expose()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  port: number;

  @Expose()
  @IsOptional()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => BotConfig)
  bot: BotConfig[];

  @Expose()
  @IsOptional()
  logger: LoggerConfig;
}
