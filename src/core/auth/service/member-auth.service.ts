import { OAuthUser } from '@/core/auth/types/oauth.type';
import { JwtService } from '@/infra/jwt/jwt.service';
import { Member } from '@/member/domain/member/member';
import { MEMBER_REPOSITORY, MemberRepository } from '@/member/domain/member/member.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class MemberAuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(MEMBER_REPOSITORY) private readonly memberRepository: MemberRepository,
  ) {}

  async getMemberIdByOAuthUser(oAuthUser: OAuthUser): Promise<string> {
    const { email, provider, providerId } = oAuthUser;

    const existMember = await this.memberRepository.findByEmailAndOAuthProvider(email, provider);
    if (existMember) {
      return existMember.id;
    }

    const member = Member.create(email, provider, providerId);
    const createdMember = await this.memberRepository.save(member);

    return createdMember.id;
  }
}
