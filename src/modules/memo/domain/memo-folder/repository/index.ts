import { MemoFolder } from '../memo-folder';

export const MEMO_FOLDER_REPOSITORY = Symbol('MEMO_FOLDER_REPOSITORY');

export interface MemoFolderRepository {
  save(memoFolder: MemoFolder): Promise<MemoFolder>;
}
