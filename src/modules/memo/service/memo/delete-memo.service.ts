import { MEMO_REPOSITORY, MemoRepository } from '@/memo/domain/memo/repository';
import { MemoValidator } from '@/memo/validator/memo.validator';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DeleteMemoService {
  constructor(
    private readonly memoValidator: MemoValidator,
    @Inject(MEMO_REPOSITORY) private readonly memoRepository: MemoRepository,
  ) {}

  async execute(slug: string) {
    const memo = await this.memoValidator.checkExistBySlug(slug);
    
    // 메모 삭제
    memo.delete();
    
    await this.memoRepository.update(memo);
  }
} 