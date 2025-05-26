import { STORAGE_SERVICE } from '@/infra/storage/service/storage.service';
import { StorageService } from '@/infra/storage/service/storage.service';
import { Memo } from '@/memo/domain/memo/memo';
import { MemoName } from '@/memo/domain/memo/memo-name';
import { MEMO_REPOSITORY, MemoRepository } from '@/memo/domain/memo/memo.repository';
import { RequestUpdateMemoNameDto } from '@/memo/dto/memo/update-memo-name.dto';
import { MemoHelper } from '@/memo/helper/memo/memo.helper';
import { MemoFolderValidator } from '@/memo/validator/memo-folder.validator';
import { MemoValidator } from '@/memo/validator/memo.validator';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UpdateMemoNameService {
  constructor(
    private readonly memoValidator: MemoValidator,
    private readonly memoFolderValidator: MemoFolderValidator,
    private readonly memoHelper: MemoHelper,
    @Inject(MEMO_REPOSITORY) private readonly memoRepository: MemoRepository,
    @Inject(STORAGE_SERVICE) private readonly storageService: StorageService,
  ) {}

  async execute(slug: string, dto: RequestUpdateMemoNameDto): Promise<Memo> {
    const { name } = dto;

    const memo = await this.memoValidator.checkExistBySlug(slug);

    await this.validateName(memo, name);

    memo.changeName(name);

    return this.memoRepository.update(memo);
  }

  private async validateName(memo: Memo, newName: string): Promise<void> {
    if (memo.name.value === newName) {
      return;
    }

    await this.memoValidator.checkExistName(newName);
  }
}
