import { Memo } from '@/memo/domain/memo/memo';
import { MEMO_REPOSITORY } from '@/memo/domain/memo/repository/memo.repository';
import { MemoRepository } from '@/memo/domain/memo/repository/memo.repository';
import { MemoFolderValidator } from '@/memo/validator/memo-folder.validator';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class FindFolderMemosService {
  constructor(
    @Inject(MEMO_REPOSITORY) private readonly memoRepository: MemoRepository,
    private readonly memoFolderValidator: MemoFolderValidator,
  ) {}

  async execute(folderId: string): Promise<Memo[]> {
    await this.memoFolderValidator.checkExist(folderId);
    return this.memoRepository.findByFolderId(folderId);
  }
}
