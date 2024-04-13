import { Expose, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class HealthcheckHostDto {
  @Expose()
  @IsOptional()
  @IsString()
  name: string;

  @Expose()
  @IsOptional()
  @IsString()
  service: string;

  @Expose()
  @IsOptional()
  @IsString()
  url: string;
}
export class HealthcheckDto {
  @Expose()
  @IsOptional()
  @IsArray()
  @Type(() => HealthcheckHostDto)
  hosts: HealthcheckHostDto[];
}
