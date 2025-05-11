import { OAuthProvider, OAuthUrl } from '@/core/auth/oauth.enum';
import { OAuthService } from '@/core/auth/service/oauth.service';
import {
  GoogleAuthorizationParams,
  GoogleGetAccessTokenBody,
  GoogleGetAccessTokenResponse,
  GoogleUserInfoResponse,
} from '@/core/auth/types/google-oauth.type';
import { OAuthSignInResult } from '@/core/auth/types/oauth.type';
import { MyConfigService } from '@/core/config/my-config.service';
import { HTTP_SERVICE, HttpService } from '@/infra/http/http.service';
import { JwtService } from '@/infra/jwt/jwt.service';
import { Inject, Injectable } from '@nestjs/common';
import { OAuthStrategy } from './oauth.strategy';

@Injectable()
export class GoogleOAuthStrategy implements OAuthStrategy {
  private readonly url = OAuthUrl[OAuthProvider.GOOGLE];
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

  async signIn(code: string, state: string): Promise<OAuthSignInResult> {
    const getAccessTokenResponse = await this.httpService.post<GoogleGetAccessTokenResponse, GoogleGetAccessTokenBody>(
      this.url.token,
      {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUrl,
      },
    );

    const getUserInfoResponse = await this.httpService.get<GoogleUserInfoResponse>(this.url.userInfo, {
      headers: {
        Authorization: `Bearer ${getAccessTokenResponse.data.access_token}`,
      },
    });

    const memberId = await this.memberAuthService.findMemberIdByOAuthUser({
      email: getUserInfoResponse.data.email,
      provider: OAuthProvider.GOOGLE,
      providerId: getUserInfoResponse.data.sub,
      profileImage: getUserInfoResponse.data.picture,
    });

    const { accessToken, refreshToken } = this.jwtService.createJwt({ id: memberId });
    return { accessToken, refreshToken, redirectUrl: state };
  }
}
