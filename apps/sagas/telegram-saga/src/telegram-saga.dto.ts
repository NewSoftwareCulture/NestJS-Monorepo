import { ClientProxy } from '@nestjs/microservices';

export type Data = {
  [key: string]: string;
};

export type Meta = {
  step?: number;
  status?: string;
  error?: string;
};

export type Payload = {
  uuid: string;
  meta: Meta;
  data: Data;
};

export type PipelineEntity = {
  service: ClientProxy | Pick<ClientProxy, 'emit'>;
  pattern: string;
};
