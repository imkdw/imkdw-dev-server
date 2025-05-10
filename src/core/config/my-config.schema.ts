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

  /**
   * Github OAuth 설정
   */
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GITHUB_REDIRECT_URL: z.string(),
  GITHUB_OAUTH_SCOPE: z.string(),

  /**
   * Google OAuth 설정
   */
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URL: z.string(),
  GOOGLE_OAUTH_SCOPE: z.string(),

  /**
   * JWT 설정
   */
  JWT_ACCESS_EXPIRE: z.string(),
  JWT_REFRESH_EXPIRE: z.string(),
  JWT_SECRET: z.string(),

  /**
   * AWS 설정
   */
  AWS_REGION: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),

  /**
   * S3 설정
   */
  AWS_S3_BUCKET_NAME: z.string(),
  AWS_S3_BUCKET_URL: z.string(),

  /**
   * 기타 설정
   */
  ENV: z.string(),
  AUTH_COOKIE_DOMAIN: z.string(),
});

export type MyConfig = z.infer<typeof myConfig>;
