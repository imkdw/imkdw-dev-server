import { Memo } from '@/memo/domain/memo/memo';
import { MEMO_REPOSITORY } from '@/memo/domain/memo/memo.repository';
import { MemoRepository } from '@/memo/domain/memo/memo.repository';
import { RequestCreateMemoDto } from '@/memo/dto/memo/create-memo.dto';
import { MemoHelper } from '@/memo/helper/memo/memo.helper';
import { MemoFolderValidator } from '@/memo/validator/memo-folder.validator';
import { MemoValidator } from '@/memo/validator/memo.validator';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateMemoService {
  constructor(
    private readonly memoFolderValidator: MemoFolderValidator,
    private readonly memoValidator: MemoValidator,
    private readonly memoHelper: MemoHelper,
    @Inject(MEMO_REPOSITORY) private readonly memoRepository: MemoRepository,
  ) {}

  async execute(dto: RequestCreateMemoDto): Promise<Memo> {
    const { name, folderId } = dto;

    await this.memoValidator.checkExistName(name);
    const memoFolder = await this.memoFolderValidator.checkExist(folderId);

    const slug = await this.memoHelper.generateSlug(name);

    const memo = Memo.create(name, slug, '', '', folderId, memoFolder.path);

    return this.memoRepository.save(memo);
  }
}
