import { Memo } from '@/memo/domain/memo/memo';
import { MemoRepository, UpdateMemoData } from '@/memo/domain/memo/memo.repository';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaMemoRepository implements MemoRepository {
  constructor(private readonly prisma: TransactionHost<TransactionalAdapterPrisma>) {}

  async save(memo: Memo): Promise<Memo> {
    const createdMemo = await this.prisma.tx.memo.create({
      data: {
        ...memo,
        name: memo.name.value,
        content: memo.content.value,
        contentHtml: memo.contentHtml.value,
      },
    });

    return Memo.from(createdMemo);
  }

  async update(memo: Memo): Promise<Memo> {
    const updatedMemo = await this.prisma.tx.memo.update({
      where: { id: memo.id },
      data: { ...memo, name: memo.name.value, content: memo.content.value, contentHtml: memo.contentHtml.value },
    });

    return Memo.from(updatedMemo);
  }

  async updateMany(memos: Memo[]): Promise<Memo[]> {
    const promises = memos.map((memo) =>
      this.prisma.tx.memo.update({
        where: { id: memo.id },
        data: {
          name: memo.name.value,
          content: memo.content.value,
          contentHtml: memo.contentHtml.value,
          path: memo.path,
          folderId: memo.folderId,
          slug: memo.slug,
        },
      }),
    );

    const updatedMemos = await Promise.all(promises);
    return updatedMemos.map(Memo.from);
  }

  async findById(id: string): Promise<Memo | null> {
    const memo = await this.prisma.tx.memo.findFirst({ where: { id, deletedAt: null } });
    return memo ? Memo.from(memo) : null;
  }

  async findAll(): Promise<Memo[]> {
    const memos = await this.prisma.tx.memo.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });

    return memos.map(Memo.from);
  }

  async findByFolderIdAndName(folderId: string, name: string): Promise<Memo | null> {
    const memo = await this.prisma.tx.memo.findFirst({ where: { folderId, name, deletedAt: null } });
    return memo ? Memo.from(memo) : null;
  }

  async findByFolderId(folderId: string): Promise<Memo[]> {
    const memos = await this.prisma.tx.memo.findMany({
      where: {
        folderId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'asc' },
    });

    return memos.map(Memo.from);
  }

  async findBySlug(slug: string): Promise<Memo | null> {
    const memo = await this.prisma.tx.memo.findFirst({ where: { slug, deletedAt: null } });
    return memo ? Memo.from(memo) : null;
  }

  async findByFolderIds(folderIds: string[]): Promise<Memo[]> {
    const memos = await this.prisma.tx.memo.findMany({
      where: {
        folderId: { in: folderIds },
        deletedAt: null,
      },
      orderBy: { createdAt: 'asc' },
    });

    return memos.map(Memo.from);
  }

  async updateManyWithData(ids: string[], data: UpdateMemoData): Promise<Memo[]> {
    const updatedMemos = await this.prisma.tx.memo.updateManyAndReturn({
      where: { id: { in: ids } },
      data,
    });

    return updatedMemos.map(Memo.from);
  }
}
