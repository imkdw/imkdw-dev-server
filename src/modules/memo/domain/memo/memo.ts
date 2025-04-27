import { generateUUID } from '@/common/utils/string.util';
import { Memo as PrismaMemo } from '@prisma/client';

export class Memo {
  id: string;
  title: string;
  slug: string;
  content: string;
  folderId: string;
  folderPath: string;
  deletedAt: Date | null;

  private constructor(id: string, title: string, slug: string, content: string, folderId: string, folderPath: string) {
    this.id = id;
    this.title = title;
    this.slug = slug;
    this.content = content;
    this.folderId = folderId;
    this.folderPath = folderPath;
  }

  static create(title: string, slug: string, content: string, folderId: string, folderPath: string): Memo {
    return new Memo(generateUUID(), title, slug, content, folderId, folderPath);
  }

  static from(data: PrismaMemo): Memo {
    return new Memo(data.id, data.title, data.slug, data.content, data.folderId, data.folderPath);
  }

  delete(): void {
    this.deletedAt = new Date();
  }
}
