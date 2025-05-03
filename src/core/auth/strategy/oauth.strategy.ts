import { GetAccessTokenResult, OAuthSignInResult } from '@/core/auth/types/oauth.type';

export interface OAuthStrategy {
  getAuthorizationUrl(redirectUrl: string): string;
  getAccessToken(code: string, state: string): Promise<GetAccessTokenResult>;
  signIn(accessToken: string): Promise<OAuthSignInResult>;
}
