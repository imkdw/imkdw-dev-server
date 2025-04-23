import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../core/database/database.module';
import { MemoFolderController } from './controller/memo-folder.controller';
import { MEMO_FOLDER_REPOSITORY } from './domain/memo-folder/repository';
import { PrismaMemoFolderRepository } from './domain/memo-folder/repository/prisma-memo-folder.repository';
import { CreateMemoFolderService } from './service/memo-folder/create-memo-folder.service';
import { MemoFolderValidator } from './validator/memo-folder.validator';
import { FindMemoFolderService } from '@/memo/service/memo-folder/find-memo-folder.service';
import { FindRootMemoFoldersService } from '@/memo/service/memo-folder/find-root-memo-folders.service';
import { FindChildMemoFoldersService } from '@/memo/service/memo-folder/find-child-memo-folders.service';
import { UpdateMemoFolderService } from '@/memo/service/memo-folder/update-memo-folder.service';
import { DeleteMemoFolderService } from '@/memo/service/memo-folder/delete-memo-folder.service';

@Module({
  imports: [DatabaseModule],
  controllers: [MemoFolderController],
  providers: [
    CreateMemoFolderService,
    FindMemoFolderService,
    FindRootMemoFoldersService,
    FindChildMemoFoldersService,
    UpdateMemoFolderService,
    DeleteMemoFolderService,
    MemoFolderValidator,
    {
      provide: MEMO_FOLDER_REPOSITORY,
      useClass: PrismaMemoFolderRepository,
    },
  ],
})
export class MemoModule {}
