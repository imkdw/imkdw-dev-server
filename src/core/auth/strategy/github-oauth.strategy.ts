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
import { HTTP_SERVICE, HttpService } from '@/infra/http/http.service';
import { JwtService } from '@/infra/jwt/jwt.service';
import { Inject, Injectable } from '@nestjs/common';
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
    @Inject(HTTP_SERVICE) private readonly httpService: HttpService,
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
    const getAccessTokenResponse = await this.httpService.post<GithubGetAccessTokenResponse, GithubGetAccessTokenBody>(
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

    const userInfoResponse = await this.httpService.get<GithubUserInfoResponse>(this.url.userInfo, {
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
