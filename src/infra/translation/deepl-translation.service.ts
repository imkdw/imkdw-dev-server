import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { MyConfigService } from '@/core/config/my-config.service';
import { TranslationTargetLanguage } from '@/infra/translation/translation.enum';
import { TranslationService } from 'src/infra/translation/translation.service';
import { DeepLTranslateResponse } from 'src/infra/translation/translation.type';

@Injectable()
export class DeepLTranslationService implements TranslationService {
  constructor(private readonly configService: MyConfigService) {}

  async translate(text: string, targetLanguage: TranslationTargetLanguage): Promise<string> {
    const URL = 'https://api-free.deepl.com/v2/translate';

    // TODO: 별도의 HTTP Client 사용
    const response = await axios.post<DeepLTranslateResponse>(
      URL,
      {
        text: [text],
        target_lang: targetLanguage,
      },
      {
        headers: {
          Authorization: `DeepL-Auth-Key 5d46f28d-10f9-4f44-a14e-9b08bbd6e34c:fx`,
        },
      },
    );

    return response.data.translations[0].text;
  }
}
