import { generateUUID } from '../../../../common/utils/string.util';
import { MemoFolderName } from './memo-folder-name';

export class MemoFolder {
  readonly id: string;
  name: MemoFolderName;
  parent: MemoFolder | null;
  children: MemoFolder[];
  path: string;
  readonly createdAt: Date;
  updatedAt: Date;

  private constructor(
    id: string,
    name: MemoFolderName,
    parent: MemoFolder | null,
    children: MemoFolder[] = [],
    path: string = '',
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this.id = id;
    this.name = name;
    this.parent = parent;
    this.children = children;
    this.path = path;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.generatePath();
  }

  private generatePath(): void {
    if (!this.parent) {
      this.path = `/${this.name.value}`;
      return;
    }
    this.path = `${this.parent.path}/${this.name.value}`;
  }

  static create(name: string, parent: MemoFolder | null): MemoFolder {
    const folder = new MemoFolder(generateUUID(), new MemoFolderName(name), parent);
    return folder;
  }

  static from(data: {
    id: string;
    name: string;
    path: string;
    parent: MemoFolder | null;
    children: MemoFolder[];
    createdAt: Date;
    updatedAt: Date;
  }): MemoFolder {
    const parent = data.parent ? MemoFolder.from({ ...data.parent, name: data.parent.name.value }) : null;

    const folder = new MemoFolder(
      data.id,
      new MemoFolderName(data.name),
      parent,
      [],
      data.path,
      data.createdAt,
      data.updatedAt,
    );

    if (data.children && Array.isArray(data.children)) {
      folder.children = data.children.map((child) =>
        MemoFolder.from({ ...child, parent: folder, name: child.name.value }),
      );
    }

    return folder;
  }
}
