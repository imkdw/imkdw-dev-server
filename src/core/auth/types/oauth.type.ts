export interface OAuthSignInResult {
  accessToken: string;
  refreshToken: string;
  redirectUrl: string;
}

export interface OAuthUser {
  email: string;
  provider: string;
  providerId: string;
}

export interface IOAuthUrl {
  authorization: string;
  token: string;
  userInfo: string;
}
