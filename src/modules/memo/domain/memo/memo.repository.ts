import { Memo } from '@/memo/domain/memo/memo';

export const MEMO_REPOSITORY = Symbol('MEMO_REPOSITORY');

export interface MemoRepository {
  save(memo: Memo): Promise<Memo>;
  update(memo: Memo): Promise<Memo>;
  updateMany(memos: Memo[]): Promise<Memo[]>;
  findById(id: string): Promise<Memo | null>;
  findAll(): Promise<Memo[]>;
  findByFolderId(folderId: string): Promise<Memo[]>;
  findByFolderIdAndName(folderId: string, name: string): Promise<Memo | null>;
  findByFolderIds(folderIds: string[]): Promise<Memo[]>;
  findBySlug(slug: string): Promise<Memo | null>;
  updateManyWithData(ids: string[], data: UpdateMemoData): Promise<Memo[]>;
}

export interface UpdateMemoData {
  deletedAt?: Date;
  path?: string;
}
