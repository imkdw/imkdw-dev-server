export interface OAuthSignInResult {
  accessToken: string;
  refreshToken: string;
}

export interface GetAccessTokenResult {
  accessToken: string;
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
