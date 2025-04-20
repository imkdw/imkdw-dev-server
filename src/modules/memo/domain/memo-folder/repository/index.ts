import { MemoFolder } from '../memo-folder';

export const MEMO_FOLDER_REPOSITORY = Symbol('MEMO_FOLDER_REPOSITORY');

export interface MemoFolderRepository {
  save(memoFolder: MemoFolder): Promise<MemoFolder>;
  findById(id: string): Promise<MemoFolder | null>;
  findByParentIdAndName(parentId: string | null, name: string): Promise<MemoFolder | null>;
  findByParentId(parentId: string | null): Promise<MemoFolder[]>;
}
