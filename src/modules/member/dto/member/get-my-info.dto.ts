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

  @ApiProperty({ description: '프로필 이미지', example: 'https://example.com/profile.jpg' })
  profileImage: string;

  private constructor(id: string, email: string, role: string, nickname: string, profileImage: string) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.nickname = nickname;
    this.profileImage = profileImage;
  }

  static from({ id, email, role, oAuthProvider, profileImage }: Member): ResponseGetMyInfoDto {
    return new ResponseGetMyInfoDto(id, email, role, oAuthProvider, profileImage);
  }
}
