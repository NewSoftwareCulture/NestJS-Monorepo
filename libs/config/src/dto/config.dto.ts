import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsString,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { BotDto } from './bot.dto';
import { LoggerDto } from './logger.dto';
import { HealthcheckDto } from './healthcheck.dto';
import { TransportDto } from './transport.dto';
import { RedisDto } from './redis.dto';

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
  @Type(() => BotDto)
  bot: BotDto[];

  @Expose()
  @IsOptional()
  healthcheck: HealthcheckDto;

  @Expose()
  @IsOptional()
  @IsString()
  prefix: string;

  @Expose()
  @IsOptional()
  transport: TransportDto;

  @Expose()
  @IsOptional()
  redis: RedisDto;

  @Expose()
  @IsOptional()
  logger: LoggerDto;
}
