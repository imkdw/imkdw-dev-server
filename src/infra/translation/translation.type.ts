import { TranslationTargetLanguage } from '@/infra/translation/translation.enum';

/**
 * DeepL 번역 API 응답 타입
 */
export interface DeepLTranslateResponse {
  translations: {
    /**
     * 원본 언어
     */
    detected_source_language: string;

    /**
     * 번역된 텍스트
     */
    text: string;
  }[];
}

/**
 * DeepL 번역 API 요청 타입
 */
export interface DeepLTranslateBody {
  text: string[];
  target_lang: TranslationTargetLanguage;
}
