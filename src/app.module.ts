import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ClsModule } from 'nestjs-cls';
import { AppController } from './app.controller';
import { AllExceptionFilter } from './common/filter/all-exception.filter';
import { DomainExceptionFilter } from './common/filter/domain-exception.filter';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { DatabaseModule } from './core/database/database.module';
import { PrismaService } from './core/database/prisma.service';
import { MemoModule } from './modules/memo/memo.module';
import { ClsPrismaModule } from 'src/config/cls-prisma.module';

@Module({
  imports: [MemoModule, ClsPrismaModule],
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
  ],
})
export class AppModule {}
