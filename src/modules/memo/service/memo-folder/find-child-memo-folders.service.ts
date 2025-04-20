import { Inject, Injectable } from '@nestjs/common';
import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { MEMO_FOLDER_REPOSITORY, MemoFolderRepository } from '@/memo/domain/memo-folder/repository';
import { MemoFolderValidator } from '@/memo/validator/memo-folder.validator';

@Injectable()
export class FindChildMemoFoldersService {
  constructor(
    @Inject(MEMO_FOLDER_REPOSITORY) private readonly memoFolderRepository: MemoFolderRepository,
    private readonly memoFolderValidator: MemoFolderValidator,
  ) {}

  async execute(parentId: string): Promise<MemoFolder[]> {
    await this.memoFolderValidator.checkExist(parentId);

    return this.memoFolderRepository.findByParentId(parentId);
  }
}
