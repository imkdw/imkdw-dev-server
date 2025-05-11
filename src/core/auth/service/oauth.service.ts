import { generatePath } from '@/common/utils/storage.util';
import { OAuthUser } from '@/core/auth/types/oauth.type';
import { HTTP_SERVICE, HttpService } from '@/infra/http/http.service';
import { STORAGE_SERVICE, StorageService } from '@/infra/storage/storage.service';
import { Member } from '@/member/domain/member/member';
import { MEMBER_REPOSITORY, MemberRepository } from '@/member/domain/member/member.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class OAuthService {
  constructor(
    @Inject(MEMBER_REPOSITORY) private readonly memberRepository: MemberRepository,
    @Inject(STORAGE_SERVICE) private readonly storageService: StorageService,
    @Inject(HTTP_SERVICE) private readonly httpService: HttpService,
  ) {}

  async findMemberIdByOAuthUser(oAuthUser: OAuthUser): Promise<string> {
    const { email, provider, providerId, profileImage } = oAuthUser;

    const existMember = await this.memberRepository.findByEmailAndOAuthProvider(email, provider);

    if (existMember) {
      return existMember.id;
    }

    const member = Member.create(email, provider, providerId, profileImage);

    const uploadedProfileImageUrl = await this.uploadProfileImage(member.id, profileImage);
    member.changeProfileImage(uploadedProfileImageUrl);

    const createdMember = await this.memberRepository.save(member);

    return createdMember.id;
  }

  private async uploadProfileImage(memberId: string, profileImageUrl: string): Promise<string> {
    const profileImageResponse = await this.httpService.get<ArrayBuffer>(profileImageUrl, {
      responseType: 'arraybuffer',
    });

    const profileImageBuffer = Buffer.from(profileImageResponse.data);
    const imageExtension = profileImageResponse.headers?.['content-type'].split('/')[1] || 'jpeg';

    const path = generatePath(
      [
        { prefix: 'members', id: memberId },
        { prefix: 'profile', id: '' },
      ],
      imageExtension,
    );

    return this.storageService.upload({ path, file: profileImageBuffer });
  }
}
