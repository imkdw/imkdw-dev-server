import { Memo } from '@/memo/domain/memo/memo';
import { MemoValidator } from '@/memo/validator/memo.validator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetMemoService {
  constructor(private readonly memoValidator: MemoValidator) {}

  async execute(slug: string): Promise<Memo> {
    return this.memoValidator.checkExistBySlug(slug);
  }
}
