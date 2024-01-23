import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { BotConfig } from './bot.dto';
import { LoggerConfig } from './logger.dto';
import { FilesConfig } from './files.dto';

class FormatsConfig {
  @Expose()
  @IsOptional()
  @IsString()
  video: string;

  @Expose()
  @IsOptional()
  @IsString()
  photo: string;
}

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

  @Expose()
  @IsOptional()
  files: FilesConfig;

  @Expose()
  @IsOptional()
  formats: FormatsConfig;
}
