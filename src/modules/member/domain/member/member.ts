import { generateUUID } from '@/common/utils/string.util';
import { MemberRole } from '@/member/member.enum';
import { Member as PrismaMember } from '@prisma/client';

export class Member {
  id: string;
  email: string;
  role: string;
  oAuthProvider: string;
  oAuthProviderId: string;
  nickname: string;
  exitedAt: Date | null;
  deletedAt: Date | null;

  private constructor(
    id: string,
    email: string,
    role: string,
    oAuthProvider: string,
    oAuthProviderId: string,
    nickname: string,
    exitedAt: Date | null,
    deletedAt: Date | null,
  ) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.oAuthProvider = oAuthProvider;
    this.oAuthProviderId = oAuthProviderId;
    this.nickname = nickname;
    this.exitedAt = exitedAt;
    this.deletedAt = deletedAt;
  }

  static create(email: string, oAuthProvider: string, oAuthProviderId: string) {
    return new Member('', email, MemberRole.USER, oAuthProvider, oAuthProviderId, this.generateNickname(), null, null);
  }

  static from(member: PrismaMember) {
    return new Member(
      member.id,
      member.email,
      member.role,
      member.oAuthProvider,
      member.oAuthProviderId,
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
