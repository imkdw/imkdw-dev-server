import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { DatabaseModule } from '../core/database/database.module';
import { PrismaService } from '../core/database/prisma.service';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      plugins: [
        new ClsPluginTransactional({
          imports: [DatabaseModule],
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: PrismaService,
          }),
        }),
      ],
    }),
  ],
})
export class ClsPrismaModule {}
