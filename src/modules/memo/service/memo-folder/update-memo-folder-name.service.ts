import { Inject, Injectable } from '@nestjs/common';
import { MEMO_FOLDER_REPOSITORY, MemoFolderRepository } from '../../domain/memo-folder/memo-folder.repository';
import { MEMO_REPOSITORY, MemoRepository } from '../../domain/memo/memo.repository';
import { RequestUpdateMemoFolderNameDto } from '../../dto/memo-folder/update-memo-folder-name.dto';
import { MemoFolderValidator } from '../../validator/memo-folder.validator';
import { Transactional } from '@nestjs-cls/transactional';
import { PrismaService } from '@/infra/persistence/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UpdateMemoFolderNameService {
  constructor(
    @Inject(MEMO_FOLDER_REPOSITORY) private readonly memoFolderRepository: MemoFolderRepository,
    @Inject(MEMO_REPOSITORY) private readonly memoRepository: MemoRepository,
    private readonly memoFolderValidator: MemoFolderValidator,
    private readonly prisma: PrismaService,
  ) {}

  @Transactional()
  async execute(id: string, dto: RequestUpdateMemoFolderNameDto): Promise<void> {
    const { name } = dto;

    const memoFolder = await this.memoFolderValidator.checkExist(id);

    if (memoFolder.name.value === name) {
      return;
    }

    await this.memoFolderValidator.checkExistName(memoFolder.parentId, name);

    const oldPath = memoFolder.path;
    memoFolder.updateName(name);

    await this.prisma.$transaction(async (tx) => {
      await this.memoFolderRepository.update(memoFolder, tx);
      await this.updateChildFoldersPaths(oldPath, memoFolder.path, tx);
      await this.updateMemosPaths(id, oldPath, memoFolder.path);
    });
  }

  /**
   * 하위 폴더들의 경로를 새로운 부모 경로로 업데이트
   */
  private async updateChildFoldersPaths(
    oldParentPath: string,
    newParentPath: string,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    const childFolders = await this.memoFolderRepository.findChildrenByPath(oldParentPath, tx);

    if (childFolders.length === 0) {
      return;
    }

    const updatedChildFolders = childFolders.map((folder) => {
      const relativePath = folder.path.substring(oldParentPath.length);
      folder.path = `${newParentPath}${relativePath}`;
      return folder;
    });

    await this.memoFolderRepository.updateMany(updatedChildFolders, tx);
  }

  /**
   * 해당 폴더와 하위 폴더들에 속한 메모들의 경로를 업데이트
   */
  private async updateMemosPaths(folderId: string, oldParentPath: string, newParentPath: string): Promise<void> {
    const affectedFolders = await this.memoFolderRepository.findChildrenByPath(oldParentPath);
    const affectedFolderIds = [folderId, ...affectedFolders.map((folder) => folder.id)];
    const affectedMemos = await this.memoRepository.findByFolderIds(affectedFolderIds);

    if (affectedMemos.length === 0) {
      return;
    }

    const memoUpdates = new Map<string, string>();

    affectedMemos.forEach((memo) => {
      const currentFolderPath = memo.path.substring(0, memo.path.lastIndexOf('/'));

      if (currentFolderPath.startsWith(oldParentPath)) {
        const relativePath = currentFolderPath.substring(oldParentPath.length);
        const newFolderPath = `${newParentPath}${relativePath}`;
        const newMemoPath = `${newFolderPath}/${memo.name.value}`;
        memoUpdates.set(memo.id, newMemoPath);
      }
    });

    if (memoUpdates.size > 0) {
      const updatePromises = Array.from(memoUpdates.entries()).map(([memoId, newPath]) => {
        const memo = affectedMemos.find((m) => m.id === memoId)!;
        memo.path = newPath;
        return this.memoRepository.update(memo);
      });

      await Promise.all(updatePromises);
    }
  }
}
