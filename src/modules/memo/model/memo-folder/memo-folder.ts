import { MemoFolderName } from './memo-folder-name';

export class MemoFolder {
  id: string;
  name: MemoFolderName;
  parent: MemoFolder | null;
  children: MemoFolder[];
  path: string;
  createdAt: Date;
  updatedAt: Date;
}
