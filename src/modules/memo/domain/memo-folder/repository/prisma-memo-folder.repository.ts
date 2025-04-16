import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma, MemoFolder as PrismaMemoFolder } from '@prisma/client';
import { MemoFolderRepository } from '.';
import { MemoFolder } from '../memo-folder';

interface PrismaMemoFolderWithParent
  extends Prisma.MemoFolderGetPayload<{
    include: {
      parent: true;
    };
  }> {}

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
      include: { parent: true },
    });

    return this.mapToDomain(createdMemoFolder);
  }

  async findById(id: string): Promise<MemoFolder | null> {
    const memoFolder = await this.prisma.tx.memoFolder.findUnique({
      where: { id },
      include: { parent: true },
    });

    return memoFolder ? this.mapToDomain(memoFolder) : null;
  }

  async findByParentIdAndName(parentId: string | null, name: string): Promise<MemoFolder | null> {
    const memoFolder = await this.prisma.tx.memoFolder.findFirst({
      where: {
        parentId,
        name,
        deletedAt: null,
      },
      include: { parent: true },
    });

    return memoFolder ? this.mapToDomain(memoFolder) : null;
  }

  private mapToDomain(memoFolder: PrismaMemoFolderWithParent): MemoFolder {
    return MemoFolder.from({
      id: memoFolder.id,
      name: memoFolder.name,
      path: memoFolder.path,
      createdAt: memoFolder.createdAt,
      updatedAt: memoFolder.updatedAt,
      parent: memoFolder.parent ? MemoFolder.from(this.prismaParentToMemoFolderData(memoFolder.parent)) : null,
      children: [],
    });
  }

  private prismaParentToMemoFolderData(prismaParent: PrismaMemoFolderWithParent): PrismaMemoFolder | null {
    if (!prismaParent) {
      return null;
    }

    return {
      id: prismaParent.id,
      name: prismaParent.name,
      parentId: prismaParent.parentId,
      path: prismaParent.path,
      updatedAt: prismaParent.updatedAt,
      createdAt: prismaParent.createdAt,
      deletedAt: prismaParent.deletedAt,
    };
  }
}
