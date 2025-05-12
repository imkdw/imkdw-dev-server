import { ClsPrismaModule } from '@/config/cls-prisma.module';
import { OAuthService } from '@/core/auth/service/oauth.service';
import { HTTP_SERVICE, HttpService } from '@/infra/http/http.service';
import { PrismaService } from '@/infra/persistence/prisma.service';
import { PrismaMemberRepository } from '@/infra/persistence/repository/prisma-member.repository';
import { STORAGE_SERVICE, StorageService } from '@/infra/storage/service/storage.service';
import { Member } from '@/member/domain/member/member';
import { MEMBER_REPOSITORY, MemberRepository } from '@/member/domain/member/member.repository';
import { Test } from '@nestjs/testing';
import { MockProxy, mock } from 'jest-mock-extended';

describe(OAuthService.name, () => {
  let prisma: PrismaService;
  let sut: OAuthService;
  let memberRepository: MemberRepository;
  let mockStorageService: MockProxy<StorageService>;
  let mockHttpService: MockProxy<HttpService>;

  beforeEach(async () => {
    mockStorageService = mock<StorageService>();
    mockHttpService = mock<HttpService>();

    const module = await Test.createTestingModule({
      imports: [ClsPrismaModule],
      providers: [
        {
          provide: MEMBER_REPOSITORY,
          useClass: PrismaMemberRepository,
        },
        {
          provide: STORAGE_SERVICE,
          useValue: mockStorageService,
        },
        {
          provide: HTTP_SERVICE,
          useValue: mockHttpService,
        },
        OAuthService,
      ],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    memberRepository = module.get<MemberRepository>(MEMBER_REPOSITORY);
    sut = module.get<OAuthService>(OAuthService);

    await prisma.member.deleteMany();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await prisma.member.deleteMany();
  });

  describe('OAuth 사용자 정보로 멤버 아이디 조회', () => {
    describe('이미 존재하는 유저가 있다면', () => {
      const member = Member.create('test@test.com', 'github', '1234567890', 'profile');

      it('기존에 존재하던 유저의 아이디를 반환한다', async () => {
        await memberRepository.save(member);

        const memberId = await sut.findMemberIdByOAuthUser({
          email: member.email,
          provider: member.oAuthProvider,
          providerId: member.oAuthProviderId,
          profileImage: 'profile',
        });

        expect(memberId).toBe(member.id);
      });
    });

    describe('기존 유저가 없다면', () => {
      it('새로운 유저를 생성한다', async () => {
        const email = 'test@test.com';
        const provider = 'github';
        const providerId = '1234567890';
        const profileImage = 'https://github.com/test.png';

        const responseImage = Buffer.from('');
        mockHttpService.get.mockResolvedValue({
          data: responseImage,
          headers: { 'content-type': 'image/png' },
        });
        mockStorageService.upload.mockResolvedValue(profileImage);

        const memberId = await sut.findMemberIdByOAuthUser({ email, provider, providerId, profileImage });

        const createdMember = await memberRepository.findByEmailAndOAuthProvider(email, provider);
        expect(createdMember).not.toBeNull();
        expect(createdMember?.id).toBe(memberId);
        expect(createdMember?.email).toBe(email);
        expect(createdMember?.oAuthProvider).toBe(provider);
        expect(createdMember?.profileImage).toBe(profileImage);

        expect(mockStorageService.upload).toHaveBeenCalledTimes(1);
      });
    });
  });
});
