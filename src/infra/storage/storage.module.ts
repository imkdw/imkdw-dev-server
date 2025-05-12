import { MyConfigModule } from '@/core/config/my-config.module';
import { S3StorageService } from '@/infra/storage/service/s3-storage.service';
import { STORAGE_SERVICE } from '@/infra/storage/service/storage.service';
import { StorageController } from '@/infra/storage/storage.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [MyConfigModule],
  controllers: [StorageController],
  providers: [
    {
      provide: STORAGE_SERVICE,
      useClass: S3StorageService,
    },
  ],
  exports: [STORAGE_SERVICE],
})
export class StorageModule {}
