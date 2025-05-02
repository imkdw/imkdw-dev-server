import { TranslationTargetLanguage } from '@/infra/translation/translation.enum';

export interface TranslationService {
  translate(text: string, targetLanguage: TranslationTargetLanguage): Promise<string>;
}
