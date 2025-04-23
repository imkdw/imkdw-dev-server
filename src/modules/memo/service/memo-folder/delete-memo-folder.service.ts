import { MEMO_FOLDER_REPOSITORY, MemoFolderRepository } from '@/memo/domain/memo-folder/repository';
import { MemoFolderValidator } from '@/memo/validator/memo-folder.validator';
import { Transactional } from '@nestjs-cls/transactional';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DeleteMemoFolderService {
  constructor(
    private readonly memoFolderValidator: MemoFolderValidator,
    @Inject(MEMO_FOLDER_REPOSITORY) private readonly memoFolderRepository: MemoFolderRepository,
  ) {}

  @Transactional()
  async execute(id: string) {
    const memoFolder = await this.memoFolderValidator.checkExist(id);
    const memoFolderChildren = await this.memoFolderRepository.findChildrenByPath(memoFolder.path);

    const deletedAt = new Date();

    // 자식 메모 폴더 제거
    const childIds = memoFolderChildren.map((child) => child.id);
    await this.memoFolderRepository.updateManyWithData(childIds, { deletedAt });

    // TODO: 자식 메모 제거

    // 메모 폴더 제거
    memoFolder.delete();
    await this.memoFolderRepository.update(memoFolder);
  }
}
