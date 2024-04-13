import { Expose } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class KafkaDto {
  @Expose()
  @IsString()
  host: string;

  @Expose()
  @IsNumber()
  port: string;

  @Expose()
  @IsString()
  topic: string;

  @Expose()
  @IsString()
  clientId: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  eachMessage: boolean;

  @Expose()
  @IsOptional()
  @IsBoolean()
  eachBatch: boolean;
}
