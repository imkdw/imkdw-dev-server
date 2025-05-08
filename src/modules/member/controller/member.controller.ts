import { GetRequester } from '@/common/decorator/requester.decorator';
import { Requester } from '@/common/types/requester.type';
import { ResponseGetMyInfoDto } from '@/member/dto/member/get-my-info.dto';
import { GetMyInfoService } from '@/member/service/member/get-my-info.service';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as Swagger from '../swagger/member.swagger';

@ApiTags('[회원]')
@Controller('members')
export class MemberController {
  constructor(private readonly getMyInfoService: GetMyInfoService) {}

  @Swagger.getMyInfo('내 정보 조회')
  @Get('me')
  async getMyInfo(@GetRequester() requester: Requester): Promise<ResponseGetMyInfoDto> {
    const member = await this.getMyInfoService.execute(requester.id);
    return ResponseGetMyInfoDto.from(member);
  }
}
