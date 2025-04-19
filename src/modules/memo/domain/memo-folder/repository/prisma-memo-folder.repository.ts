import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma, MemoFolder as PrismaMemoFolder } from '@prisma/client';
import { MemoFolderRepository } from '.';
import { MemoFolder } from '../memo-folder';

@Injectable()
export class PrismaMemoFolderRepository implements MemoFolderRepository {
  constructor(private readonly prisma: TransactionHost<TransactionalAdapterPrisma>) {}

  async save(memoFolder: MemoFolder): Promise<MemoFolder> {
    const createdMemoFolder = await this.prisma.tx.memoFolder.create({
      data: {
        id: memoFolder.id,
        name: memoFolder.name.value,
        parentId: memoFolder.parentId,
        path: memoFolder.path,
      },
    });

    return MemoFolder.from(createdMemoFolder);
  }

  async findById(id: string): Promise<MemoFolder | null> {
    const memoFolder = await this.prisma.tx.memoFolder.findUnique({
      where: { id },
    });

    return memoFolder ? MemoFolder.from(memoFolder) : null;
  }

  async findByParentIdAndName(parentId: string | null, name: string): Promise<MemoFolder | null> {
    const memoFolder = await this.prisma.tx.memoFolder.findFirst({
      where: {
        parentId,
        name,
        deletedAt: null,
      },
    });

    return memoFolder ? MemoFolder.from(memoFolder) : null;
  }
}
