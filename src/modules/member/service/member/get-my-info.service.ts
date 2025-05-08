import { MemberNotFoundException } from '@/member/domain/member/exception/member-not-found.exception';
import { Member } from '@/member/domain/member/member';
import { MEMBER_REPOSITORY, MemberRepository } from '@/member/domain/member/member.repository';
import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';

@Injectable()
export class GetMyInfoService {
  constructor(@Inject(MEMBER_REPOSITORY) private readonly memberRepository: MemberRepository) {}

  async execute(memberId: string): Promise<Member> {
    const member = await this.memberRepository.findById(memberId);

    if (!member) {
      throw new MemberNotFoundException(`${memberId} 회원을 찾을 수 없습니다`);
    }

    return member;
  }
}
