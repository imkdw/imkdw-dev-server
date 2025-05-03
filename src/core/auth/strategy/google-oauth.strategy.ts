import { SignInFailureException } from '@/core/auth/exception/sign-in-failure.exception';
import { OAuthProvider, OAuthUrl } from '@/core/auth/oauth.enum';
import {
  GoogleAuthorizationParams,
  GoogleGetAccessTokenBody,
  GoogleGetAccessTokenResponse,
  GoogleUserInfoResponse,
} from '@/core/auth/types/google-oauth.type';
import { GetAccessTokenResult, OAuthSignInResult } from '@/core/auth/types/oauth.type';
import { MyConfigService } from '@/core/config/my-config.service';
import { JwtService } from '@/infra/jwt/jwt.service';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { OAuthStrategy } from './oauth.strategy';
import { OAuthService } from '@/core/auth/service/oauth.service';

@Injectable()
export class GoogleOAuthStrategy extends OAuthStrategy {
  private readonly url = OAuthUrl[OAuthProvider.GOOGLE];
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
    this.clientId = this.configService.get('GOOGLE_CLIENT_ID');
    this.clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
    this.redirectUrl = this.configService.get('GOOGLE_REDIRECT_URL');
    this.scope = this.configService.get('GOOGLE_OAUTH_SCOPE');
  }

  getAuthorizationUrl(clientRedirectUrl: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUrl,
      response_type: 'code',
      scope: this.scope,
      state: clientRedirectUrl,
    } satisfies GoogleAuthorizationParams);

    return `${this.url.authorization}?${params.toString()}`;
  }

  async getAccessToken(code: string, state: string): Promise<GetAccessTokenResult> {
    // TODO: 공통 HTTP 클라이언트로 변경
    const response = await axios.post<GoogleGetAccessTokenResponse>(
      this.url.token,
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUrl,
      } satisfies GoogleGetAccessTokenBody,
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

    const response = await axios.get<GoogleUserInfoResponse>(this.url.userInfo, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const memberId = await this.memberAuthService.getMemberIdByOAuthUser({
      email: response.data.email,
      provider: OAuthProvider.GOOGLE,
      providerId: response.data.sub,
    });

    return this.jwtService.createJwt({ id: memberId });
  }
}
