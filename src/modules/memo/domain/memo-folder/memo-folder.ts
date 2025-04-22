import { generateUUID } from '../../../../common/utils/string.util';
import { MemoFolder as PrismaMemoFolder } from '@prisma/client';
import { MemoFolderName } from './memo-folder-name';

export class MemoFolder {
  id: string;
  name: MemoFolderName;
  parentId: string | null;
  path: string;

  private constructor(id: string, name: MemoFolderName, parentId: string | null, path: string) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
    this.path = path;
  }

  static create(name: string, parentId: string | null, parentPath: string = ''): MemoFolder {
    const generatedPath = MemoFolder.generatePath(parentPath, name);
    return new MemoFolder(generateUUID(), new MemoFolderName(name), parentId, generatedPath);
  }

  static from(data: PrismaMemoFolder): MemoFolder {
    return new MemoFolder(data.id, new MemoFolderName(data.name), data.parentId, data.path);
  }

  static generatePath(parentPath: string, name: string): string {
    return parentPath ? `${parentPath}/${name}` : `/${name}`;
  }

  updatePath(newParentPath: string): void {
    this.path = MemoFolder.generatePath(newParentPath, this.name.value);
  }

  updateName(newName: string): void {
    this.name = new MemoFolderName(newName);
    this.path = MemoFolder.generatePath(this.path.substring(0, this.path.lastIndexOf('/')), newName);
  }

  updateParentFolder(parentFolder: MemoFolder | null): void {
    this.parentId = parentFolder?.id ?? null;
    this.path = MemoFolder.generatePath(parentFolder?.path ?? '', this.name.value);
  }
}
