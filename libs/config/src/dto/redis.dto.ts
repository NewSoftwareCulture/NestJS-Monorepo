import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class RedisDto {
  @Expose()
  @IsOptional()
  @IsString()
  host: string;

  @Expose()
  @IsOptional()
  @IsString()
  port: string;

  @Expose()
  @IsOptional()
  @IsString()
  username: string;

  @Expose()
  @IsOptional()
  @IsString()
  password: string;
}
