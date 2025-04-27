import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MyConfig } from './my-config.schema.js';

@Injectable()
export class MyConfigService {
  constructor(private readonly configService: ConfigService) {}

  get<T extends keyof MyConfig>(key: T): MyConfig[T] {
    return this.configService.get(key)!;
  }
}
