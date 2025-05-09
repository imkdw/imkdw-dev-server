import { generateUUID } from '@/common/utils/string.util';
import { MemberRole } from '@/member/member.enum';
import { Member as PrismaMember } from '@prisma/client';

export class Member {
  id: string;
  email: string;
  role: string;
  oAuthProvider: string;
  oAuthProviderId: string;
  profileImage: string;
  nickname: string;
  exitedAt: Date | null;
  deletedAt: Date | null;

  private constructor(
    id: string,
    email: string,
    role: string,
    oAuthProvider: string,
    oAuthProviderId: string,
    profileImage: string,
    nickname: string,
    exitedAt: Date | null,
    deletedAt: Date | null,
  ) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.oAuthProvider = oAuthProvider;
    this.oAuthProviderId = oAuthProviderId;
    this.profileImage = profileImage;
    this.nickname = nickname;
    this.exitedAt = exitedAt;
    this.deletedAt = deletedAt;
  }

  static create(email: string, oAuthProvider: string, oAuthProviderId: string, profileImage: string) {
    return new Member(
      generateUUID(),
      email,
      MemberRole.USER,
      oAuthProvider,
      oAuthProviderId,
      profileImage,
      this.generateNickname(),
      null,
      null,
    );
  }

  static from(member: PrismaMember) {
    return new Member(
      member.id,
      member.email,
      member.role,
      member.oAuthProvider,
      member.oAuthProviderId,
      member.profileImage,
      member.nickname,
      member.exitedAt,
      member.deletedAt,
    );
  }

  private static generateNickname() {
    // TODO: 임시 로직
    return generateUUID();
  }
}
