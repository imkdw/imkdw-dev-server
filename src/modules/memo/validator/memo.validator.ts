import { Inject, Injectable } from '@nestjs/common';
import { MEMO_REPOSITORY } from '@/memo/domain/memo/repository';
import { MemoRepository } from '@/memo/domain/memo/repository';
import { MemoNotFoundException } from '@/memo/domain/memo/exception/memo-not-found.exception';
import { DuplicateMemoNameException } from '@/memo/domain/memo/exception/duplicate-memo-name.exception';

@Injectable()
export class MemoValidator {
  constructor(@Inject(MEMO_REPOSITORY) private readonly memoRepository: MemoRepository) {}

  async checkExistBySlug(slug: string) {
    const memo = await this.memoRepository.findBySlug(slug);

    if (!memo) {
      throw new MemoNotFoundException(`${slug} 메모를 찾을 수 없습니다.`);
    }

    return memo;
  }

  async checkExistName(name: string) {
    const memo = await this.memoRepository.findByName(name);

    if (memo) {
      throw new DuplicateMemoNameException(`${name} 메모가 이미 존재합니다.`);
    }
  }
}
