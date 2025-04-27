import { TranslationTargetLanguage } from 'src/infra/translation/translation.const';

export interface TranslationService {
  translate(text: string, targetLanguage: TranslationTargetLanguage): Promise<string>;
}
