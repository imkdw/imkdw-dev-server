import { OAuthProvider } from '@/core/auth/oauth.enum';
import { Member } from '@/member/domain/member/member';

export const MEMBER_REPOSITORY = Symbol('MEMBER_REPOSITORY');

export interface MemberRepository {
  save(member: Member): Promise<Member>;
  findByEmailAndOAuthProvider(email: string, oAuthProvider: OAuthProvider): Promise<Member | null>;
}
