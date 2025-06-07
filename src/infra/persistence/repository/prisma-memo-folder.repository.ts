import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { MemoFolderRepository, UpdateMemoFolderData } from '@/memo/domain/memo-folder/memo-folder.repository';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';

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
      where: { id, deletedAt: null },
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
      orderBy: { createdAt: 'asc' },
    });

    return memoFolders.map(MemoFolder.from);
  }

  async update(memoFolder: MemoFolder, tx = this.prisma.tx): Promise<MemoFolder> {
    const updatedMemoFolder = await tx.memoFolder.update({
      where: { id: memoFolder.id },
      data: {
        name: memoFolder.name.value,
        parentId: memoFolder.parentId,
        path: memoFolder.path,
      },
    });

    return MemoFolder.from(updatedMemoFolder);
  }

  async findChildrenByPath(path: string, tx = this.prisma.tx): Promise<MemoFolder[]> {
    const memoFolders = await tx.memoFolder.findMany({
      where: {
        path: { startsWith: path },
        deletedAt: null,
      },
    });

    return memoFolders.map(MemoFolder.from);
  }

  async updateMany(memoFolders: MemoFolder[], tx = this.prisma.tx): Promise<MemoFolder[]> {
    const promises = memoFolders.map((memoFolder) => {
      return tx.memoFolder.update({
        where: { id: memoFolder.id },
        data: {
          name: memoFolder.name.value,
          parentId: memoFolder.parentId,
          path: memoFolder.path,
        },
      });
    });

    const updatedMemoFolders = await Promise.all(promises);

    return updatedMemoFolders.map(MemoFolder.from);
  }

  async updateManyWithData(ids: string[], data: UpdateMemoFolderData): Promise<MemoFolder[]> {
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
