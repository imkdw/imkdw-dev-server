import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { Memo } from '@/memo/domain/memo/memo';
import { MemoName } from '@/memo/domain/memo/memo-name';
import { MEMO_REPOSITORY, MemoRepository } from '@/memo/domain/memo/repository';
import { RequestUpdateMemoDto } from '@/memo/dto/memo/update-memo.dto';
import { MemoHelper } from '@/memo/helper/memo/memo.helper';
import { MemoFolderValidator } from '@/memo/validator/memo-folder.validator';
import { MemoValidator } from '@/memo/validator/memo.validator';
import { Inject, Injectable } from '@nestjs/common';

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
    const newFolder = await this.memoFolderValidator.checkExist(folderId);

    await this.validateName(memo, name);

    const newFolderPath = await this.getNewFolderPath(memo, newFolder, name);
    const newSlug = await this.getNewSlug(memo, name);

    memo.name = new MemoName(name);
    memo.slug = newSlug;
    memo.folderId = folderId;
    memo.path = newFolderPath;
    memo.content = content;

    return this.memoRepository.update(memo);
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

  private async getNewFolderPath(memo: Memo, memoFolder: MemoFolder, newName: string): Promise<string> {
    const name = memo.name.value === newName ? memo.name.value : newName;

    return `${memoFolder.path}/${name}`;
  }
}
