import { MemoFolder as PrismaMemoFolder } from '@prisma/client';
import { generateUUID } from '../../../../common/utils/string.util';
import { MemoFolderName } from './memo-folder-name';

export class MemoFolder {
  id: string;
  name: MemoFolderName;
  parentId: string | null;
  path: string;
  deletedAt: Date | null = null;

  private constructor(id: string, name: MemoFolderName, path: string, parentId: string | null) {
    this.id = id;
    this.name = name;
    this.path = path;
    this.parentId = parentId;
  }

  static create(name: string, parentId: string | null, parentPath = ''): MemoFolder {
    const generatedPath = MemoFolder.generatePath(parentPath, name);
    return new MemoFolder(generateUUID(), new MemoFolderName(name), generatedPath, parentId);
  }

  static from(data: PrismaMemoFolder): MemoFolder {
    return new MemoFolder(data.id, new MemoFolderName(data.name), data.path, data.parentId);
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

  delete(): void {
    this.deletedAt = new Date();
  }
}
