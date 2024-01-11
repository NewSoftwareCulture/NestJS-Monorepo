import { Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

class LoggerConfig {
  @Expose()
  @IsOptional()
  @IsString()
  level: string;

  @Expose()
  @IsOptional()
  @IsString()
  label: string;

  @Expose()
  @IsOptional()
  @IsString()
  filename: string;

  @Expose()
  @IsOptional()
  @IsString()
  filenameWarn: string;

  @Expose()
  @IsOptional()
  @IsString()
  filenameError: string;
}

export class ConfigDto {
  @Expose()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  port: number;

  @Expose()
  @IsOptional()
  @IsString()
  bot_token: string;

  @Expose()
  @IsOptional()
  logger: LoggerConfig;
}
