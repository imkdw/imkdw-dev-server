import { Member } from '@/member/domain/member/member';

export const MEMBER_REPOSITORY = Symbol('MEMBER_REPOSITORY');

export interface MemberRepository {
  save(member: Member): Promise<Member>;
  findByEmailAndOAuthProvider(email: string, oAuthProvider: string): Promise<Member | null>;
  findById(id: string): Promise<Member | null>;
}
