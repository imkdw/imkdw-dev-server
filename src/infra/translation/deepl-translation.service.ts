import { Inject, Injectable } from '@nestjs/common';

import { TranslationTargetLanguage } from '@/infra/translation/translation.enum';
import { TranslationService } from 'src/infra/translation/translation.service';
import { DeepLTranslateBody, DeepLTranslateResponse } from 'src/infra/translation/translation.type';
import { HTTP_SERVICE, HttpService } from '@/infra/http/http.service';
import { MyConfigService } from '@/core/config/my-config.service';

@Injectable()
export class DeepLTranslationService implements TranslationService {
  constructor(
    @Inject(HTTP_SERVICE) private readonly httpService: HttpService,
    private readonly configService: MyConfigService,
  ) {}

  async translate(text: string, targetLanguage: TranslationTargetLanguage): Promise<string> {
    const URL = 'https://api-free.deepl.com/v2/translate';

    const response = await this.httpService.post<DeepLTranslateResponse, DeepLTranslateBody>(
      URL,
      {
        text: [text],
        target_lang: targetLanguage,
      },
      {
        headers: {
          Authorization: `DeepL-Auth-Key ${this.configService.get('DEEPL_AUTH_KEY')}`,
        },
      },
    );

    return response.data.translations[0].text;
  }
}
