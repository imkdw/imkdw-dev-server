import { IOAuthUrl } from '@/core/auth/types/oauth.type';

export enum OAuthProvider {
  GOOGLE = 'google',
  GITHUB = 'github',
}

export const OAuthUrl: Record<OAuthProvider, IOAuthUrl> = {
  google: {
    authorization: 'https://accounts.google.com/o/oauth2/v2/auth',
    token: 'https://oauth2.googleapis.com/token',
    userInfo: 'https://www.googleapis.com/oauth2/v3/userinfo',
  },
  github: {
    authorization: 'https://github.com/login/oauth/authorize',
    token: 'https://github.com/login/oauth/access_token',
    userInfo: 'https://api.github.com/user',
  },
};
