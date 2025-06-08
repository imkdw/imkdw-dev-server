import { Memo } from '@/memo/domain/memo/memo';
import { MEMO_REPOSITORY, MemoRepository } from '@/memo/domain/memo/memo.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetMemosService {
  constructor(@Inject(MEMO_REPOSITORY) private readonly memoRepository: MemoRepository) {}

  async execute(): Promise<Memo[]> {
    return this.memoRepository.findAll();
  }
}
