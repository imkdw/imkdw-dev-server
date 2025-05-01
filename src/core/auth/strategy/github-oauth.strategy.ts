import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { OAuthStrategy } from './oauth.strategy';
import { OAuthProvider, OAuthUrl } from '@/core/auth/oauth.const';
import { MyConfigService } from '@/core/config/my-config.service';
import { GetAccessTokenResult, OAuthSignInResult } from '@/core/auth/types/oauth.type';
import {
  GithubGetAccessTokenBody,
  GithubAuthorizationParams,
  GithubGetAccessTokenResponse,
  GithubUserInfoResponse,
} from '@/core/auth/types/github-oauth.type';
import axios from 'axios';
import { SignInFailureException } from '@/core/auth/exception/sign-in-failure.exception';
import { JwtService } from '@/infra/jwt/jwt.service';

@Injectable()
export class GithubOAuthStrategy extends OAuthStrategy {
  private readonly url = OAuthUrl[OAuthProvider.GITHUB];
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUrl: string;

  constructor(
    private readonly configService: MyConfigService,
    protected readonly prisma: TransactionHost<TransactionalAdapterPrisma>,
    protected readonly jwtService: JwtService,
  ) {
    super(prisma, jwtService);
    this.clientId = this.configService.get('GITHUB_CLIENT_ID');
    this.clientSecret = this.configService.get('GITHUB_CLIENT_SECRET');
    this.redirectUrl = this.configService.get('GITHUB_REDIRECT_URL');
  }

  getAuthorizationUrl(clientRedirectUrl: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUrl,
      scope: this.configService.get('GITHUB_OAUTH_SCOPE'),
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

    // TODO: 유저 정보 조회
    const response = await axios.get<GithubUserInfoResponse>(this.url.userInfo, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return this.prisma.withTransaction(async () => {
      const memberId = await this.getMemberId({
        email: response.data.email,
        provider: OAuthProvider.GITHUB,
        providerId: response.data.id.toString(),
      });

      return this.generateJwt(memberId);
    });
  }
}
