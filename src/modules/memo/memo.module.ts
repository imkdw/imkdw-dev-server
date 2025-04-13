import { Module } from '@nestjs/common';
import { CreateMemoFolderService } from './service/memo-folder/create-memo-folder.service';
import { MemoFolderController } from './controller/memo-folder.controller';
import { PrismaMemoFolderRepository } from './domain/memo-folder/repository/prisma-memo-folder.repository';
import { DatabaseModule } from '../../core/database/database.module';
import { MEMO_FOLDER_REPOSITORY } from './domain/memo-folder/repository';
import { MemoFolderValidator } from './validator/memo-folder.validator';

@Module({
  imports: [DatabaseModule],
  controllers: [MemoFolderController],
  providers: [
    CreateMemoFolderService,
    MemoFolderValidator,
    {
      provide: MEMO_FOLDER_REPOSITORY,
      useClass: PrismaMemoFolderRepository,
    },
  ],
})
export class MemoModule {}
