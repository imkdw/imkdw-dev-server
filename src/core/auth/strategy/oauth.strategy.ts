import { OAuthSignInResult } from '@/core/auth/types/oauth.type';

export interface OAuthStrategy {
  getAuthorizationUrl(redirectUrl: string): string;
  signIn(code: string, state: string): Promise<OAuthSignInResult>;
}
