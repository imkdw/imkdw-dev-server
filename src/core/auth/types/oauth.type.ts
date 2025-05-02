import { OAuthProvider } from '@/core/auth/oauth.enum';

export interface OAuthSignInResult {
  accessToken: string;
  refreshToken: string;
}

export interface GetAccessTokenResult {
  accessToken: string;
  redirectUrl: string;
}

export interface OAuthUserInfo {
  email: string;
  provider: OAuthProvider;
  providerId: string;
}

export interface IOAuthUrl {
  authorization: string;
  token: string;
  userInfo: string;
}
