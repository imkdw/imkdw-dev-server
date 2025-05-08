import { Member } from '@/member/domain/member/member';
import { MemberRole } from '@/member/member.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseGetMyInfoDto {
  @ApiProperty({ description: '회원 ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: '이메일', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: '회원 역할', enum: MemberRole, example: MemberRole.USER })
  role: string;

  @ApiProperty({ description: '닉네임', example: '노드고수' })
  nickname: string;

  private constructor(id: string, email: string, role: string, nickname: string) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.nickname = nickname;
  }

  static from(member: Member): ResponseGetMyInfoDto {
    return new ResponseGetMyInfoDto(member.id, member.email, member.role, member.oAuthProvider);
  }
}
