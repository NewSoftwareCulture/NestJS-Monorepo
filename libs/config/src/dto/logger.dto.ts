import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class LoggerConfig {
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
