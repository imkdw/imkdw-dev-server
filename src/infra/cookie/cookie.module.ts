import { Module } from '@nestjs/common';

import { MyConfigModule } from '@/core/config/my-config.module';
import { CookieService } from './cookie.service';

@Module({
  imports: [MyConfigModule],
  providers: [CookieService],
  exports: [CookieService],
})
export class CookieModule {}
