import { Inject, Injectable } from '@nestjs/common';
import { RequestCreateMemoFolderDto } from '../../dto/memo-folder/create-memo-folder.dto';
import { MemoFolder } from 'src/modules/memo/domain/memo-folder/memo-folder';
import { MEMO_FOLDER_REPOSITORY, MemoFolderRepository } from '../../domain/memo-folder/repository';

@Injectable()
export class CreateMemoFolderService {
  constructor(@Inject(MEMO_FOLDER_REPOSITORY) private readonly memoFolderRepository: MemoFolderRepository) {}

  async execute(dto: RequestCreateMemoFolderDto) {
    const { name, parentId } = dto;

    // 폴더명 중복여부 검사
    // 부모 폴더가 요청되었을 경우 존재여부 검사
    // 폴더 생성

    const parentMemoFolder = await this.getParentMemoFolder(parentId);
    const memoFolder = MemoFolder.create(name, parentMemoFolder);
    return this.memoFolderRepository.save(memoFolder);
  }

  private async getParentMemoFolder(parentId: string | null) {
    return null;
  }
}
