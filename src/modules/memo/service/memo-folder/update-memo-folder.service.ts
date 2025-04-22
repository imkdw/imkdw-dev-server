import { Inject, Injectable } from '@nestjs/common';
import { MemoFolder } from '../../domain/memo-folder/memo-folder';
import { MEMO_FOLDER_REPOSITORY, MemoFolderRepository } from '../../domain/memo-folder/repository';
import { RequestUpdateMemoFolderDto } from '../../dto/memo-folder/update-memo-folder.dto';
import { MemoFolderValidator } from '../../validator/memo-folder.validator';

@Injectable()
export class UpdateMemoFolderService {
  constructor(
    @Inject(MEMO_FOLDER_REPOSITORY) private readonly memoFolderRepository: MemoFolderRepository,
    private readonly memoFolderValidator: MemoFolderValidator,
  ) {}

  async execute(id: string, dto: RequestUpdateMemoFolderDto): Promise<MemoFolder> {
    const { name, parentId } = dto;

    const memoFolder = await this.memoFolderValidator.checkExist(id);

    if (memoFolder.name.value !== name) {
      await this.memoFolderValidator.checkExistName(parentId, name);
    }

    const parentMemoFolder = await this.memoFolderValidator.checkExistParentMemoFolder(parentId);

    memoFolder.updateName(name);
    memoFolder.updateParentFolder(parentMemoFolder);

    return this.memoFolderRepository.update(memoFolder);
  }
}
