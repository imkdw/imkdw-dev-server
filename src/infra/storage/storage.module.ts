import { MyConfigModule } from '@/core/config/my-config.module';
import { S3StorageService } from '@/infra/storage/s3-storage.service';
import { STORAGE_SERVICE } from '@/infra/storage/storage.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [MyConfigModule],
  providers: [
    {
      provide: STORAGE_SERVICE,
      useClass: S3StorageService,
    },
  ],
  exports: [STORAGE_SERVICE],
})
export class StorageModule {}
