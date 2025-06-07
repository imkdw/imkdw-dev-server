import { generateStoragePath } from '@/common/utils/storage.util';
import { STORAGE_SERVICE } from '@/infra/storage/service/storage.service';
import { StorageService } from '@/infra/storage/service/storage.service';
import { MemoFolder } from '@/memo/domain/memo-folder/memo-folder';
import { Memo } from '@/memo/domain/memo/memo';
import { MemoContent } from '@/memo/domain/memo/memo-content';
import { MemoName } from '@/memo/domain/memo/memo-name';
import { MEMO_REPOSITORY, MemoRepository } from '@/memo/domain/memo/memo.repository';
import { RequestUpdateMemoDto } from '@/memo/dto/memo/update-memo.dto';
import { MemoHelper } from '@/memo/helper/memo/memo.helper';
import { MemoFolderValidator } from '@/memo/validator/memo-folder.validator';
import { MemoValidator } from '@/memo/validator/memo.validator';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UpdateMemoService {
  constructor(
    private readonly memoValidator: MemoValidator,
    private readonly memoFolderValidator: MemoFolderValidator,
    private readonly memoHelper: MemoHelper,
    @Inject(MEMO_REPOSITORY) private readonly memoRepository: MemoRepository,
    @Inject(STORAGE_SERVICE) private readonly storageService: StorageService,
  ) {}

  async execute(slug: string, dto: RequestUpdateMemoDto): Promise<Memo> {
    const { name, content, contentHtml, folderId, imageUrls } = dto;

    const memo = await this.memoValidator.checkExistBySlug(slug);
    const newFolder = await this.memoFolderValidator.checkExist(folderId);

    const newImageUrls = await Promise.all(
      imageUrls.map(async (imageUrl) => {
        const imageName = imageUrl.split('/').pop()!;
        const extension = imageUrl.split('.').pop()!;
        const path = generateStoragePath(
          [
            { id: memo.id, prefix: 'memos' },
            { id: 'images', prefix: '' },
          ],
          extension,
        );

        return this.storageService.copyTempImage(imageName, path);
      }),
    );

    await this.validateName(memo, name);

    const newFolderPath = await this.getNewFolderPath(memo, newFolder, name);
    const newSlug = await this.getNewSlug(memo, name);
    const newContent = new MemoContent(content).replaceImageUrls(imageUrls, newImageUrls);
    const newContentHtml = new MemoContent(contentHtml).replaceImageUrls(imageUrls, newImageUrls);

    memo.name = new MemoName(name);
    memo.slug = newSlug;
    memo.folderId = folderId;
    memo.path = newFolderPath;
    memo.content = newContent;
    memo.contentHtml = newContentHtml;

    const updatedMemo = await this.memoRepository.update(memo);

    return updatedMemo;
  }

  private async validateName(memo: Memo, newName: string): Promise<void> {
    if (memo.name.value === newName) {
      return;
    }

    await this.memoValidator.checkExistName(memo.folderId, newName);
  }

  private async getNewSlug(memo: Memo, newName: string): Promise<string> {
    if (memo.name.value === newName) {
      return memo.slug;
    }

    return this.memoHelper.generateSlug(newName);
  }

  private async getNewFolderPath(memo: Memo, memoFolder: MemoFolder, newName: string): Promise<string> {
    const name = memo.name.value === newName ? memo.name.value : newName;

    return `${memoFolder.path}/${name}`;
  }
}
