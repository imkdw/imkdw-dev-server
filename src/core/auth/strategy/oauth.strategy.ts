import { generateUUID } from '@/common/utils/string.util';
import { GetAccessTokenResult, OAuthSignInResult, OAuthUserInfo } from '@/core/auth/types/oauth.type';
import { JwtService } from '@/infra/jwt/jwt.service';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { MemberRole } from 'src/modules/member/member.enum';

export abstract class OAuthStrategy {
  constructor(
    protected readonly prisma: TransactionHost<TransactionalAdapterPrisma>,
    protected readonly jwtService: JwtService,
  ) {}

  abstract getAuthorizationUrl(redirectUrl: string): string;
  abstract getAccessToken(code: string, state: string): Promise<GetAccessTokenResult>;
  abstract signIn(accessToken: string): Promise<OAuthSignInResult>;

  protected async getMemberId(userInfo: OAuthUserInfo): Promise<string> {
    const existMember = await this.prisma.tx.member.findFirst({
      where: {
        oAuthProvider: userInfo.provider,
        email: userInfo.email,
      },
    });

    if (existMember) {
      return existMember.id;
    }

    const createdMember = await this.prisma.tx.member.create({
      data: {
        email: userInfo.email,
        // TODO: 임시로직
        nickname: generateUUID(),
        oAuthProvider: userInfo.provider,
        oAuthProviderId: userInfo.providerId,
        role: MemberRole.USER,
      },
    });

    return createdMember.id;
  }

  protected generateJwt(memberId: string) {
    return this.jwtService.createJwt({ id: memberId });
  }

  protected extractToken(authorizationHeader: string): string {
    if (!authorizationHeader) {
      return '';
    }

    const [type, token] = authorizationHeader.split(' ');
    if (type !== 'Bearer') {
      return '';
    }

    return token;
  }
}
