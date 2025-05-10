import { OAuthProvider, OAuthUrl } from '@/core/auth/oauth.enum';
import { OAuthService } from '@/core/auth/service/oauth.service';
import {
  GithubAuthorizationParams,
  GithubGetAccessTokenBody,
  GithubGetAccessTokenResponse,
  GithubUserInfoResponse,
} from '@/core/auth/types/github-oauth.type';
import { OAuthSignInResult } from '@/core/auth/types/oauth.type';
import { MyConfigService } from '@/core/config/my-config.service';
import { JwtService } from '@/infra/jwt/jwt.service';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { OAuthStrategy } from './oauth.strategy';

@Injectable()
export class GithubOAuthStrategy implements OAuthStrategy {
  private readonly url = OAuthUrl[OAuthProvider.GITHUB];
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUrl: string;
  private readonly scope: string;

  constructor(
    private readonly configService: MyConfigService,
    private readonly memberAuthService: OAuthService,
    private readonly jwtService: JwtService,
  ) {
    this.clientId = this.configService.get('GITHUB_CLIENT_ID');
    this.clientSecret = this.configService.get('GITHUB_CLIENT_SECRET');
    this.redirectUrl = this.configService.get('GITHUB_REDIRECT_URL');
    this.scope = this.configService.get('GITHUB_OAUTH_SCOPE');
  }

  getAuthorizationUrl(clientRedirectUrl: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUrl,
      scope: this.scope,
      state: clientRedirectUrl,
    } satisfies GithubAuthorizationParams);

    return `${this.url.authorization}?${params.toString()}`;
  }

  async signIn(code: string, state: string): Promise<OAuthSignInResult> {
    // TODO: 공통 HTTP 클라이언트로 변경
    const getAccessTokenResponse = await axios.post<GithubGetAccessTokenResponse>(
      this.url.token,
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
      } satisfies GithubGetAccessTokenBody,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );

    // TODO: 공통 HTTP 클라이언트로 변경
    const userInfoResponse = await axios.get<GithubUserInfoResponse>(this.url.userInfo, {
      headers: {
        Authorization: `Bearer ${getAccessTokenResponse.data.access_token}`,
      },
    });

    const memberId = await this.memberAuthService.findMemberIdByOAuthUser({
      email: userInfoResponse.data.email,
      provider: OAuthProvider.GITHUB,
      providerId: userInfoResponse.data.id.toString(),
      profileImage: userInfoResponse.data.avatar_url,
    });

    const { accessToken, refreshToken } = this.jwtService.createJwt({ id: memberId });

    return { accessToken, refreshToken, redirectUrl: state };
  }
}
