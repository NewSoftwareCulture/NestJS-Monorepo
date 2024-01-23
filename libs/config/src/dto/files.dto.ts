import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class FilesConfig {
  @Expose()
  @IsOptional()
  @IsString()
  input: string;

  @Expose()
  @IsOptional()
  @IsString()
  output: string;

  @Expose()
  @IsOptional()
  @IsString()
  buffer: string;
}
