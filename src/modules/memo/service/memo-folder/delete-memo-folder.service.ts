import { MEMO_FOLDER_REPOSITORY, MemoFolderRepository } from '@/memo/domain/memo-folder/repository';
import { MemoFolderValidator } from '@/memo/validator/memo-folder.validator';
import { Transactional } from '@nestjs-cls/transactional';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class DeleteMemoFolderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly memoFolderValidator: MemoFolderValidator,
    @Inject(MEMO_FOLDER_REPOSITORY) private readonly memoFolderRepository: MemoFolderRepository,
  ) {}

  @Transactional()
  async execute(id: string) {
    const memoFolder = await this.memoFolderValidator.checkExist(id);
    const memoFolderChildren = await this.memoFolderRepository.findChildrenByPath(memoFolder.path);

    const deletedAt = new Date();

    // 자식 메모 폴더 제거
    await this.memoFolderRepository.updateManyWithData(
      memoFolderChildren.map((child) => child.id),
      { deletedAt },
    );

    // TODO: 자식 메모 제거
    memoFolder.delete();
    await this.memoFolderRepository.update(memoFolder);
  }
}
