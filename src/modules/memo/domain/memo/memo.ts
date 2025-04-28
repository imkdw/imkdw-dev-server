import { generateUUID } from '@/common/utils/string.util';
import { Memo as PrismaMemo } from '@prisma/client';

export class Memo {
  id: string;
  name: string;
  slug: string;
  content: string;
  folderId: string;
  path: string;
  deletedAt: Date | null;

  private constructor(id: string, title: string, slug: string, content: string, folderId: string, path: string) {
    this.id = id;
    this.name = title;
    this.slug = slug;
    this.content = content;
    this.folderId = folderId;
    this.path = path;
    this.deletedAt = null;
  }

  static generatePath(title: string, folderPath: string): string {
    return `${folderPath}/${title}`;
  }

  static create(title: string, slug: string, content: string, folderId: string, folderPath: string): Memo {
    const path = this.generatePath(title, folderPath);
    return new Memo(generateUUID(), title, slug, content, folderId, path);
  }

  static from(prisma: PrismaMemo): Memo {
    return new Memo(prisma.id, prisma.name, prisma.slug, prisma.content, prisma.folderId, prisma.path);
  }

  delete(): void {
    this.deletedAt = new Date();
  }
}
