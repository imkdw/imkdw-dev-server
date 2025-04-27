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
