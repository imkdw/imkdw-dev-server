import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { MemoFolderValidator } from '@/memo/validator/memo-folder.validator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindMemoFolderService {
  constructor(private readonly memoFolderValidator: MemoFolderValidator) {}

  async execute(id: string): Promise<MemoFolder> {
    return this.memoFolderValidator.checkExist(id);
  }
}
