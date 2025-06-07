import { DuplicateMemoNameException } from '@/memo/domain/memo/exception/duplicate-memo-name.exception';
import { MemoNotFoundException } from '@/memo/domain/memo/exception/memo-not-found.exception';
import { MEMO_REPOSITORY } from '@/memo/domain/memo/memo.repository';
import { MemoRepository } from '@/memo/domain/memo/memo.repository';
import { Inject, Injectable } from '@nestjs/common';

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

  async checkExistName(folderId: string, name: string) {
    const memo = await this.memoRepository.findByFolderIdAndName(folderId, name);

    if (memo) {
      throw new DuplicateMemoNameException(`${name} 메모가 이미 존재합니다.`);
    }
  }
}
