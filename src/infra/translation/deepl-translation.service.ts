import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { TranslationTargetLanguage } from 'src/infra/translation/translation.const';
import { TranslationService } from 'src/infra/translation/translation.service';
import { DeepLTranslateResponse } from 'src/infra/translation/translation.type';

@Injectable()
export class DeepLTranslationService implements TranslationService {
  async translate(text: string, targetLanguage: TranslationTargetLanguage): Promise<string> {
    const URL = 'https://api-free.deepl.com/v2/translate';

    // TODO: 별도의 HTTP Client 사용
    const response = await axios.post<DeepLTranslateResponse>(URL, {
      text: [text],
      target_lang: targetLanguage,
    });

    return response.data.text;
  }
}
