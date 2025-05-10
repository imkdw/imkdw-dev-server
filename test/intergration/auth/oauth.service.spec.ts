import { ClsPrismaModule } from '@/config/cls-prisma.module';
import { OAuthService } from '@/core/auth/service/oauth.service';
import { PrismaService } from '@/infra/persistence/prisma.service';
import { PrismaMemberRepository } from '@/infra/persistence/repository/prisma-member.repository';
import { Member } from '@/member/domain/member/member';
import { MEMBER_REPOSITORY, MemberRepository } from '@/member/domain/member/member.repository';
import { Test } from '@nestjs/testing';

describe(OAuthService.name, () => {
  let prisma: PrismaService;
  let sut: OAuthService;
  let memberRepository: MemberRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ClsPrismaModule],
      providers: [
        {
          provide: MEMBER_REPOSITORY,
          useClass: PrismaMemberRepository,
        },
        OAuthService,
      ],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    memberRepository = module.get<MemberRepository>(MEMBER_REPOSITORY);
    sut = module.get<OAuthService>(OAuthService);

    await prisma.member.deleteMany();
  });

  afterAll(async () => {
    await prisma.member.deleteMany();
  });

  describe('OAuth 사용자 정보로 멤버 아이디 조회', () => {
    describe('이미 존재하는 유저가 있다면', () => {
      const member = Member.create('test@test.com', 'github', '1234567890');

      it('기존재 존재하던 유저의 아이디를 반환한다', async () => {
        memberRepository.save(member);

        const memberId = await sut.findMemberIdByOAuthUser({
          email: member.email,
          provider: member.oAuthProvider,
          providerId: member.oAuthProviderId,
        });

        expect(memberId).toBe(member.id);
      });
    });

    describe('기존 유저가 없다면', () => {
      it('새로운 유저를 생성하고 아이디를 반환한다', async () => {
        const email = 'test@test.com';
        const provider = 'github';
        const providerId = '1234567890';

        const memberId = await sut.findMemberIdByOAuthUser({ email, provider, providerId });

        const createdMember = await memberRepository.findByEmailAndOAuthProvider(email, provider);

        expect(createdMember).not.toBeNull();
        expect(createdMember?.id).toBe(memberId);
        expect(createdMember?.email).toBe(email);
        expect(createdMember?.oAuthProvider).toBe(provider);
        expect(createdMember?.oAuthProviderId).toBe(providerId);
      });
    });
  });
});
