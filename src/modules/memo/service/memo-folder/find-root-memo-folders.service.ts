import { Inject, Injectable } from '@nestjs/common';
import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { MEMO_FOLDER_REPOSITORY, MemoFolderRepository } from '@/memo/domain/memo-folder/repository';

@Injectable()
export class FindRootMemoFoldersService {
  constructor(@Inject(MEMO_FOLDER_REPOSITORY) private readonly memoFolderRepository: MemoFolderRepository) {}

  async execute(): Promise<MemoFolder[]> {
    return this.memoFolderRepository.findByParentId(null);
  }
}
