import { Prisma } from '@prisma/client';
import { MemoFolder } from './memo-folder';

export const MEMO_FOLDER_REPOSITORY = Symbol('MEMO_FOLDER_REPOSITORY');

export interface MemoFolderRepository {
  save(memoFolder: MemoFolder): Promise<MemoFolder>;
  findById(id: string): Promise<MemoFolder | null>;
  findByParentIdAndName(parentId: string | null, name: string): Promise<MemoFolder | null>;
  findByParentId(parentId: string | null): Promise<MemoFolder[]>;
  findChildrenByPath(path: string, tx?: Prisma.TransactionClient): Promise<MemoFolder[]>;
  update(memoFolder: MemoFolder, tx?: Prisma.TransactionClient): Promise<MemoFolder>;
  updateMany(memoFolders: MemoFolder[], tx?: Prisma.TransactionClient): Promise<MemoFolder[]>;
  updateManyWithData(ids: string[], data: UpdateMemoFolderData): Promise<MemoFolder[]>;
}

export interface UpdateMemoFolderData {
  deletedAt?: Date;
}
