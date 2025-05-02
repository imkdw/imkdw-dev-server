import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AllExceptionFilter } from './common/filter/all-exception.filter';
import { DomainExceptionFilter } from './common/filter/domain-exception.filter';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { MemoModule } from './modules/memo/memo.module';
import { ClsPrismaModule } from 'src/config/cls-prisma.module';
import { AuthModule } from '@/core/auth/auth.module';
import { JwtGuard } from '@/common/guards/jwt.guard';
import { MyConfigModule } from '@/core/config/my-config.module';
import { JwtModule } from '@/infra/jwt/jwt.module';
import { LoggingInterceptor } from '@/common/interceptor/logging.interceptor';

@Module({
  imports: [MemoModule, ClsPrismaModule, AuthModule, MyConfigModule, JwtModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
