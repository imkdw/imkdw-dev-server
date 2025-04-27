import { slugify } from '@/common/utils/string.util';
import { TRANSLATION_SERVICE, TranslationTargetLanguage } from '@/infra/translation/translation.const';
import { TranslationService } from '@/infra/translation/translation.service';
import { Memo } from '@/memo/domain/memo/memo';
import { MEMO_REPOSITORY } from '@/memo/domain/memo/repository';
import { MemoRepository } from '@/memo/domain/memo/repository';
import { RequestCreateMemoDto } from '@/memo/dto/memo/create-memo.dto';
import { MemoFolderValidator } from '@/memo/validator/memo-folder.validator';
import { MemoValidator } from '@/memo/validator/memo.validator';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreateMemoService {
  constructor(
    @Inject(TRANSLATION_SERVICE) private readonly translationService: TranslationService,
    @Inject(MEMO_REPOSITORY) private readonly memoRepository: MemoRepository,
    private readonly memoFolderValidator: MemoFolderValidator,
    private readonly memoValidator: MemoValidator,
  ) {}

  async execute(dto: RequestCreateMemoDto): Promise<Memo> {
    const { name, content, folderId } = dto;

    await this.memoValidator.checkExistName(name);
    const memoFolder = await this.memoFolderValidator.checkExist(folderId);

    const slug = await this.getMemoSlug(name);
    const memo = Memo.create(name, slug, content, folderId, memoFolder.path);

    return this.memoRepository.save(memo);
  }

  private async getMemoSlug(name: string): Promise<string> {
    const translatedName = await this.translationService.translate(name, TranslationTargetLanguage.EN);
    return slugify(translatedName);
  }
}
