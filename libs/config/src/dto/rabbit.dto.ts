import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RabbitDto {
  @Expose()
  @IsOptional()
  @IsString()
  user: string;

  @Expose()
  @IsOptional()
  @IsString()
  password: string;

  @Expose()
  @IsOptional()
  @IsString()
  host: string;

  @Expose()
  @IsOptional()
  @IsString()
  queue: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  prefetchCount: number;
}
