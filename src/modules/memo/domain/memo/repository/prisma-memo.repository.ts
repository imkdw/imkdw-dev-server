import { Memo } from '@/memo/domain/memo/memo';
import { MemoRepository } from '@/memo/domain/memo/repository';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaMemoRepository implements MemoRepository {
  constructor(private readonly prisma: TransactionHost<TransactionalAdapterPrisma>) {}

  async save(memo: Memo): Promise<Memo> {
    const createdMemo = await this.prisma.tx.memo.create({ data: memo });

    return Memo.from(createdMemo);
  }

  async findById(id: string): Promise<Memo | null> {
    const memo = await this.prisma.tx.memo.findFirst({ where: { id, deletedAt: null } });
    return memo ? Memo.from(memo) : null;
  }

  async findByName(name: string): Promise<Memo | null> {
    const memo = await this.prisma.tx.memo.findFirst({ where: { name, deletedAt: null } });
    return memo ? Memo.from(memo) : null;
  }

  async findByFolderId(folderId: string): Promise<Memo[]> {
    const memos = await this.prisma.tx.memo.findMany({
      where: {
        folderId,
        deletedAt: null,
      },
    });

    return memos.map(Memo.from);
  }

  async findBySlug(slug: string): Promise<Memo | null> {
    const memo = await this.prisma.tx.memo.findFirst({ 
      where: { 
        slug, 
        deletedAt: null 
      } 
    });
    return memo ? Memo.from(memo) : null;
  }
}
