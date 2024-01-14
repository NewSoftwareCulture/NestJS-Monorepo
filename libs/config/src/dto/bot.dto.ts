import { Expose, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class BotConfig {
  @Expose()
  @IsOptional()
  @IsString()
  name: string;

  @Expose()
  @IsOptional()
  @IsString()
  token: string;

  @Expose()
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  admin: number[];
}
