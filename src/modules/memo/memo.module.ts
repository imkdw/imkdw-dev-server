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
import { MemoController } from '@/memo/controller/memo.controller';
import { CreateMemoService } from '@/memo/service/memo/create-memo.service';
import { FindFolderMemosService } from '@/memo/service/memo/find-folder-memos.service';
import { GetMemoService } from '@/memo/service/memo/get-memo.service';
import { TranslationModule } from 'src/infra/translation/translation.module';
import { MEMO_REPOSITORY } from '@/memo/domain/memo/repository';
import { PrismaMemoRepository } from '@/memo/domain/memo/repository/prisma-memo.repository';
import { MemoValidator } from '@/memo/validator/memo.validator';
import { UpdateMemoService } from './service/memo/update-memo.service';
import { MemoHelper } from '@/memo/helper/memo/memo.helper';

@Module({
  imports: [DatabaseModule, TranslationModule],
  controllers: [MemoFolderController, MemoController],
  providers: [
    /**
     * 메모 폴더
     */
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

    /**
     * 메모
     */
    CreateMemoService,
    FindFolderMemosService,
    GetMemoService,
    MemoValidator,
    MemoHelper,
    {
      provide: MEMO_REPOSITORY,
      useClass: PrismaMemoRepository,
    },
    UpdateMemoService,
  ],
})
export class MemoModule {}
