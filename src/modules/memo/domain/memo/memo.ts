import { generateUUID } from '@/common/utils/string.util';
import { Memo as PrismaMemo } from '@prisma/client';

export class Memo {
  id: string;
  name: string;
  slug: string;
  content: string;
  folderId: string;
  folderPath: string;
  deletedAt: Date | null;

  private constructor(id: string, title: string, slug: string, content: string, folderId: string, folderPath: string) {
    this.id = id;
    this.name = title;
    this.slug = slug;
    this.content = content;
    this.folderId = folderId;
    this.folderPath = folderPath;
    this.deletedAt = null;
  }

  static create(title: string, slug: string, content: string, folderId: string, folderPath: string): Memo {
    return new Memo(generateUUID(), title, slug, content, folderId, folderPath);
  }

  static from(prisma: PrismaMemo): Memo {
    return new Memo(prisma.id, prisma.name, prisma.slug, prisma.content, prisma.folderId, prisma.folderPath);
  }

  delete(): void {
    this.deletedAt = new Date();
  }
}
