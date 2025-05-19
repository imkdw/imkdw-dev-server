import { MemoController } from '@/memo/controller/memo.controller';
import { MemoHelper } from '@/memo/helper/memo/memo.helper';
import { DeleteMemoFolderService } from '@/memo/service/memo-folder/delete-memo-folder.service';
import { FindChildMemoFoldersService } from '@/memo/service/memo-folder/find-child-memo-folders.service';
import { FindMemoFolderService } from '@/memo/service/memo-folder/find-memo-folder.service';
import { FindRootMemoFoldersService } from '@/memo/service/memo-folder/find-root-memo-folders.service';
import { UpdateMemoFolderService } from '@/memo/service/memo-folder/update-memo-folder.service';
import { CreateMemoService } from '@/memo/service/memo/create-memo.service';
import { DeleteMemoService } from '@/memo/service/memo/delete-memo.service';
import { FindFolderMemosService } from '@/memo/service/memo/find-folder-memos.service';
import { GetMemoService } from '@/memo/service/memo/get-memo.service';
import { MemoValidator } from '@/memo/validator/memo.validator';
import { Module } from '@nestjs/common';
import { TranslationModule } from 'src/infra/translation/translation.module';
import { MemoFolderController } from './controller/memo-folder.controller';
import { CreateMemoFolderService } from './service/memo-folder/create-memo-folder.service';
import { UpdateMemoService } from './service/memo/update-memo.service';
import { MemoFolderValidator } from './validator/memo-folder.validator';
import { StorageModule } from '@/infra/storage/storage.module';
import { UpdateMemoNameService } from './service/memo/update-memo-name.service';
@Module({
  imports: [TranslationModule, StorageModule],
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

    /**
     * 메모
     */
    CreateMemoService,
    FindFolderMemosService,
    GetMemoService,
    UpdateMemoService,
    DeleteMemoService,
    UpdateMemoNameService,
    MemoValidator,
    MemoHelper,
  ],
})
export class MemoModule {}
