import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

import { RabbitDto } from './rabbit.dto';
import { KafkaDto } from './kafka.dto';

export class TransportDto {
  @Expose()
  @IsOptional()
  rabbit: RabbitDto;

  @Expose()
  @IsOptional()
  kafka: KafkaDto;
}
