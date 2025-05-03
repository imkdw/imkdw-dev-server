import { SignInFailureException } from '@/core/auth/exception/sign-in-failure.exception';
import { OAuthProvider, OAuthUrl } from '@/core/auth/oauth.enum';
import {
  GithubAuthorizationParams,
  GithubGetAccessTokenBody,
  GithubGetAccessTokenResponse,
  GithubUserInfoResponse,
} from '@/core/auth/types/github-oauth.type';
import { GetAccessTokenResult, OAuthSignInResult } from '@/core/auth/types/oauth.type';
import { MyConfigService } from '@/core/config/my-config.service';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { OAuthStrategy } from './oauth.strategy';
import { OAuthService } from '@/core/auth/service/oauth.service';
import { JwtService } from '@/infra/jwt/jwt.service';

@Injectable()
export class GithubOAuthStrategy extends OAuthStrategy {
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
    super();
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

  async getAccessToken(code: string, state: string): Promise<GetAccessTokenResult> {
    // TODO: 공통 HTTP 클라이언트로 변경
    const response = await axios.post<GithubGetAccessTokenResponse>(
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

    return { accessToken: response.data.access_token, redirectUrl: state };
  }

  async signIn(githubAccessToken: string): Promise<OAuthSignInResult> {
    const token = this.extractToken(githubAccessToken);
    if (!token) {
      throw new SignInFailureException('깃허브 엑세스 토큰이 전달되지 않았습니다');
    }

    const response = await axios.get<GithubUserInfoResponse>(this.url.userInfo, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const memberId = await this.memberAuthService.getMemberIdByOAuthUser({
      email: response.data.email,
      provider: OAuthProvider.GITHUB,
      providerId: response.data.id.toString(),
    });

    return this.jwtService.createJwt({ id: memberId });
  }
}
