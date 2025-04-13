import { Inject, Injectable } from '@nestjs/common';
import { MEMO_FOLDER_REPOSITORY, MemoFolderRepository } from '../domain/memo-folder/repository';
import { DuplicateMemoFolderNameException } from '../domain/memo-folder/exception/duplicate-memo-folder-name.exception';
import { MemoFolderNotFoundException } from '../domain/memo-folder/exception/memo-folder-not-found.exception';
import { MemoFolder } from '../domain/memo-folder/memo-folder';

@Injectable()
export class MemoFolderValidator {
  constructor(@Inject(MEMO_FOLDER_REPOSITORY) private readonly memoFolderRepository: MemoFolderRepository) {}

  async checkExist(id: string) {
    const folder = await this.memoFolderRepository.findById(id);

    if (!folder) {
      throw new MemoFolderNotFoundException(`Memo folder with id ${id} not found`);
    }

    return folder;
  }

  async checkExistName(parentId: string | null, name: string) {
    const folder = await this.memoFolderRepository.findByParentIdAndName(parentId, name);

    if (folder) {
      throw new DuplicateMemoFolderNameException(`Duplicate memo folder name: ${name}`);
    }
  }

  async checkExistParentMemoFolder(parentId: string | null): Promise<MemoFolder | null> {
    if (!parentId) {
      return null;
    }

    return this.checkExist(parentId);
  }
}
