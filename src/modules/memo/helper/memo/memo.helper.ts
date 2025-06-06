import { slugify } from '@/common/utils/string.util';
import { TRANSLATION_SERVICE, TranslationTargetLanguage } from '@/infra/translation/translation.enum';
import { TranslationService } from '@/infra/translation/translation.service';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class MemoHelper {
  constructor(@Inject(TRANSLATION_SERVICE) private readonly translationService: TranslationService) {}

  async generateSlug(name: string): Promise<string> {
    const translatedSlug = await this.translationService.translate(name, TranslationTargetLanguage.EN);

    return slugify(translatedSlug);
  }
}
