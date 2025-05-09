import { Inject, Injectable } from '@nestjs/common';
import { MemoFolder } from '../../domain/memo-folder/memo-folder';
import { MEMO_FOLDER_REPOSITORY, MemoFolderRepository } from '../../domain/memo-folder/memo-folder.repository';
import { RequestCreateMemoFolderDto } from '../../dto/memo-folder/create-memo-folder.dto';
import { MemoFolderValidator } from '../../validator/memo-folder.validator';

@Injectable()
export class CreateMemoFolderService {
  constructor(
    @Inject(MEMO_FOLDER_REPOSITORY) private readonly memoFolderRepository: MemoFolderRepository,
    private readonly memoFolderValidator: MemoFolderValidator,
  ) {}

  async execute(dto: RequestCreateMemoFolderDto) {
    const { name, parentId } = dto;

    await this.memoFolderValidator.checkExistName(parentId, name);
    const parentMemoFolder = await this.memoFolderValidator.checkExistParentMemoFolder(parentId);

    const memoFolder = MemoFolder.create(name, parentId, parentMemoFolder?.path);

    return this.memoFolderRepository.save(memoFolder);
  }
}
