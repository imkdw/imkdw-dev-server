import { GetAccessTokenResult, OAuthSignInResult } from '@/core/auth/types/oauth.type';

export abstract class OAuthStrategy {
  abstract getAuthorizationUrl(redirectUrl: string): string;
  abstract getAccessToken(code: string, state: string): Promise<GetAccessTokenResult>;
  abstract signIn(accessToken: string): Promise<OAuthSignInResult>;

  protected extractToken(authorizationHeader: string): string {
    if (!authorizationHeader) {
      return '';
    }

    const [type, token] = authorizationHeader.split(' ');
    if (type !== 'Bearer') {
      return '';
    }

    return token;
  }
}
