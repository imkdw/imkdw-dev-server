import { myConfig } from '@/core/config/my-config.schema';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MyConfigService } from './my-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      validate: (config) => myConfig.parse(config),
    }),
  ],
  providers: [MyConfigService],
  exports: [MyConfigService],
})
export class MyConfigModule {}
