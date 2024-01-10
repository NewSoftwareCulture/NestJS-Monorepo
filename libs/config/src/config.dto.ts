import { Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

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
}
