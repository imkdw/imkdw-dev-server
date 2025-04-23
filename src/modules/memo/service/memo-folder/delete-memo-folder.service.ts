import { MemoFolderValidator } from '@/memo/validator/memo-folder.validator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class DeleteMemoFolderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly memoFolderValidator: MemoFolderValidator,
  ) {}

  async execute(id: string) {
    await this.memoFolderValidator.checkExist(id);

    return this.prisma.memoFolder.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
