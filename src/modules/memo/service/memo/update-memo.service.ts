import { MEMO_REPOSITORY, MemoRepository } from '@/memo/domain/memo/repository';
import { Memo } from '@/memo/domain/memo/memo';
import { RequestUpdateMemoDto } from '@/memo/dto/memo/update-memo.dto';
import { MemoValidator } from '@/memo/validator/memo.validator';
import { Inject, Injectable } from '@nestjs/common';
import { MemoFolderValidator } from '@/memo/validator/memo-folder.validator';
import { MemoHelper } from '@/memo/helper/memo/memo.helper';

@Injectable()
export class UpdateMemoService {
  constructor(
    private readonly memoValidator: MemoValidator,
    private readonly memoFolderValidator: MemoFolderValidator,
    private readonly memoHelper: MemoHelper,
    @Inject(MEMO_REPOSITORY) private readonly memoRepository: MemoRepository,
  ) {}

  async execute(slug: string, dto: RequestUpdateMemoDto): Promise<Memo> {
    const { name, content, folderId } = dto;

    const memo = await this.memoValidator.checkExistBySlug(slug);
    const newFolderPath = await this.getNewFolderPath(memo, folderId);
    const newSlug = await this.getNewSlug(memo, name);
    await this.validateName(memo, name);

    const updatedMemo = Memo.create(name, newSlug, content, folderId, newFolderPath);

    return this.memoRepository.update(updatedMemo);
  }

  private async validateName(memo: Memo, newName: string): Promise<void> {
    if (memo.name.value === newName) {
      return;
    }

    await this.memoValidator.checkExistName(newName);
  }

  private async getNewSlug(memo: Memo, newName: string): Promise<string> {
    if (memo.name.value === newName) {
      return memo.slug;
    }

    return this.memoHelper.generateSlug(newName);
  }

  private async getNewFolderPath(memo: Memo, newFolderId: string): Promise<string> {
    const newFolder = await this.memoFolderValidator.checkExist(newFolderId);

    if (memo.folderId === newFolderId) {
      return memo.path;
    }

    const newFolderPath = `${newFolder.path}/${memo.name.value}`;
    return newFolderPath;
  }
}
