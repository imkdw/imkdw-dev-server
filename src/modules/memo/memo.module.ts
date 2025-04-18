import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../core/database/database.module';
import { MemoFolderController } from './controller/memo-folder.controller';
import { MEMO_FOLDER_REPOSITORY } from './domain/memo-folder/repository';
import { PrismaMemoFolderRepository } from './domain/memo-folder/repository/prisma-memo-folder.repository';
import { CreateMemoFolderService } from './service/memo-folder/create-memo-folder.service';
import { MemoFolderValidator } from './validator/memo-folder.validator';
import { FindMemoFolderService } from '@/memo/service/memo-folder/find-memo-folder.service';

@Module({
  imports: [DatabaseModule],
  controllers: [MemoFolderController],
  providers: [
    CreateMemoFolderService,
    FindMemoFolderService,
    MemoFolderValidator,
    {
      provide: MEMO_FOLDER_REPOSITORY,
      useClass: PrismaMemoFolderRepository,
    },
  ],
})
export class MemoModule {}
