import { MEMO_FOLDER_REPOSITORY, MemoFolderRepository } from '@/memo/domain/memo-folder/memo-folder.repository';
import { MEMO_REPOSITORY, MemoRepository } from '@/memo/domain/memo/repository/memo.repository';
import { MemoFolderValidator } from '@/memo/validator/memo-folder.validator';
import { Transactional } from '@nestjs-cls/transactional';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DeleteMemoFolderService {
  constructor(
    private readonly memoFolderValidator: MemoFolderValidator,
    @Inject(MEMO_FOLDER_REPOSITORY) private readonly memoFolderRepository: MemoFolderRepository,
    @Inject(MEMO_REPOSITORY) private readonly memoRepository: MemoRepository,
  ) {}

  @Transactional()
  async execute(id: string) {
    const memoFolder = await this.memoFolderValidator.checkExist(id);
    const memoFolderChildren = await this.memoFolderRepository.findChildrenByPath(memoFolder.path);

    const deletedAt = new Date();

    // 자식 메모 폴더 제거
    const childIds = memoFolderChildren.map((child) => child.id);
    await this.memoFolderRepository.updateManyWithData(childIds, { deletedAt });

    // 자식 메모 제거
    const childMemos = await this.memoRepository.findByFolderIds(childIds);
    const childMemoIds = childMemos.map((memo) => memo.id);
    await this.memoRepository.updateManyWithData(childMemoIds, { deletedAt });

    memoFolder.delete();

    await this.memoFolderRepository.update(memoFolder);
  }
}
