import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class LoggerDto {
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
  directory: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  file: boolean;

  @Expose()
  @IsOptional()
  @IsBoolean()
  file_warn: boolean;

  @Expose()
  @IsOptional()
  @IsBoolean()
  file_error: boolean;
}
