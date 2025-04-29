import { generateUUID } from '@/common/utils/string.util';
import { MemoName } from '@/memo/domain/memo/memo-name';
import { Memo as PrismaMemo } from '@prisma/client';

export class Memo {
  id: string;
  name: MemoName;
  slug: string;
  content: string;
  folderId: string;
  path: string;
  deletedAt: Date | null;

  private constructor(id: string, name: string, slug: string, content: string, folderId: string, path: string) {
    this.id = id;
    this.name = new MemoName(name);
    this.slug = slug;
    this.content = content;
    this.folderId = folderId;
    this.path = path;
    this.deletedAt = null;
  }

  static generatePath(name: string, folderPath: string): string {
    return `${folderPath}/${name}`;
  }

  static create(name: string, slug: string, content: string, folderId: string, folderPath: string): Memo {
    const path = this.generatePath(name, folderPath);
    return new Memo(generateUUID(), name, slug, content, folderId, path);
  }

  static from(prisma: PrismaMemo): Memo {
    return new Memo(prisma.id, prisma.name, prisma.slug, prisma.content, prisma.folderId, prisma.path);
  }

  delete(): void {
    this.deletedAt = new Date();
  }
}
