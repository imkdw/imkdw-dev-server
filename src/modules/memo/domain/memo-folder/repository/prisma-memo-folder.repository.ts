import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma, MemoFolder as PrismaMemoFolder } from '@prisma/client';
import { MemoFolderRepository, UpdateMemoFolderData } from '.';
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

  async findByParentId(parentId: string | null): Promise<MemoFolder[]> {
    const memoFolders = await this.prisma.tx.memoFolder.findMany({
      where: {
        parentId,
        deletedAt: null,
      },
    });

    return memoFolders.map(MemoFolder.from);
  }

  async update(memoFolder: MemoFolder): Promise<MemoFolder> {
    const updatedMemoFolder = await this.prisma.tx.memoFolder.update({
      where: { id: memoFolder.id },
      data: {
        name: memoFolder.name.value,
        parentId: memoFolder.parentId,
        path: memoFolder.path,
      },
    });

    return MemoFolder.from(updatedMemoFolder);
  }

  async findChildrenByPath(path: string): Promise<MemoFolder[]> {
    const memoFolders = await this.prisma.tx.memoFolder.findMany({
      where: {
        path: {
          startsWith: path,
        },
      },
    });

    return memoFolders.map(MemoFolder.from);
  }

  async updateMany(memoFolders: MemoFolder[]): Promise<MemoFolder[]> {
    const promises = memoFolders.map((memoFolder) =>
      this.prisma.tx.memoFolder.update({
        where: { id: memoFolder.id },
        data: {
          name: memoFolder.name.value,
          parentId: memoFolder.parentId,
          path: memoFolder.path,
        },
      }),
    );

    const updatedMemoFolders = await Promise.all(promises);

    return updatedMemoFolders.map(MemoFolder.from);
  }

  async updateManyWithData(ids: MemoFolder['id'][], data: UpdateMemoFolderData): Promise<MemoFolder[]> {
    const updatedData = await this.prisma.tx.memoFolder.updateManyAndReturn({
      where: {
        id: { in: ids },
      },
      data: {
        ...(data?.deletedAt && { deletedAt: data.deletedAt }),
      },
    });

    return updatedData.map(MemoFolder.from);
  }
}
