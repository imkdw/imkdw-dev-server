import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { MemoFolder as PrismaMemoFolder } from '@prisma/client';

export class MemoFolderMapper {
  static toDomain(memoFolder: PrismaMemoFolder): MemoFolder {
    return MemoFolder.from(memoFolder);
  }
}
