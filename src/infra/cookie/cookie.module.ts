import { Module } from '@nestjs/common';

import { CookieService } from './cookie.service';
import { MyConfigModule } from '@/core/config/my-config.module';

@Module({
  imports: [MyConfigModule],
  providers: [CookieService],
  exports: [CookieService],
})
export class CookieModule {}
