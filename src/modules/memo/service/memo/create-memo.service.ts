import { Memo } from '@/memo/domain/memo/memo';
import { RequestCreateMemoDto } from '@/memo/dto/memo/create-memo.dto';
import { Inject, Injectable } from '@nestjs/common';
import { TRANSLATION_SERVICE, TranslationTargetLanguage } from 'src/infra/translation/translation.const';
import { TranslationService } from 'src/infra/translation/translation.service';

@Injectable()
export class CreateMemoService {
  constructor(@Inject(TRANSLATION_SERVICE) private readonly translationService: TranslationService) {}

  async create(dto: RequestCreateMemoDto): Promise<Memo> {
    const { title, content, folderId, folderPath } = dto;

    const slug = await this.getMemoSlug(title);

    const memo = Memo.create(title, slug, content, folderId, folderPath);

    return memo;
  }

  private async getMemoSlug(title: string): Promise<string> {
    const translatedTitle = await this.translationService.translate(title, TranslationTargetLanguage.EN);
  }
}
