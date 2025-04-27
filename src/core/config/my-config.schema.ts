import { z } from 'zod';

export const myConfig = z.object({
  /**
   * 데이터베이스 설정
   */
  DATABASE_URL: z.string(),

  /**
   * DeepL 설정
   */
  DEEPL_AUTH_KEY: z.string(),
});

export type MyConfig = z.infer<typeof myConfig>;
