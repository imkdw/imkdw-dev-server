import { MyConfigModule } from '@/core/config/my-config.module';
import { JwtService } from '@/infra/jwt/jwt.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [MyConfigModule],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
