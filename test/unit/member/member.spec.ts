import { Member } from '@/member/domain/member/member';
import { MemberRole } from '@/member/member.enum';

describe('새로운 유저가 생성되면', () => {
  it('기본 권한이 USER로 생성된다', () => {
    const sut = Member.create('test@test.com', 'github', '1234567890', 'profile');

    expect(sut.role).toBe(MemberRole.USER);
  });
});
