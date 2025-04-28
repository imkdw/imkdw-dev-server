import { Memo } from '@/memo/domain/memo/memo';

export const MEMO_REPOSITORY = Symbol('MEMO_REPOSITORY');

export interface MemoRepository {
  save(memo: Memo): Promise<Memo>;
  findById(id: string): Promise<Memo | null>;
  findByName(name: string): Promise<Memo | null>;
  findByFolderId(folderId: string): Promise<Memo[]>;
  findBySlug(slug: string): Promise<Memo | null>;
}
