import { Injectable } from '@nestjs/common';
import { MemoFolderRepository } from '.';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { MemoFolder } from '../memo-folder';
import { MemoFolder as PrismaMemoFolder } from '@prisma/client';

@Injectable()
export class PrismaMemoFolderRepository implements MemoFolderRepository {
  constructor(private readonly prisma: TransactionHost<TransactionalAdapterPrisma>) {}

  async save(memoFolder: MemoFolder): Promise<MemoFolder> {
    const createdMemoFolder = await this.prisma.tx.memoFolder.create({
      data: {
        id: memoFolder.id,
        name: memoFolder.name.value,
        parentId: memoFolder.parent ? memoFolder.parent.id : null,
        path: memoFolder.path,
      },
    });

    return this.mapToDomain(createdMemoFolder);
  }

  private async mapToDomain(memoFolder: PrismaMemoFolder): Promise<MemoFolder> {
    return MemoFolder.from({
      id: memoFolder.id,
      name: memoFolder.name,
      path: memoFolder.path,
      createdAt: memoFolder.createdAt,
      updatedAt: memoFolder.updatedAt,
    });
  }
}
