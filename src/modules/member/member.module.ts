import { PrismaMemberRepository } from '@/infra/persistence/repository/prisma-member.repository';
import { MemberController } from '@/member/controller/member.controller';
import { MEMBER_REPOSITORY } from '@/member/domain/member/member.repository';
import { GetMyInfoService } from '@/member/service/member/get-my-info.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [MemberController],
  providers: [
    GetMyInfoService,
    {
      provide: MEMBER_REPOSITORY,
      useClass: PrismaMemberRepository,
    },
  ],
})
export class MemberModule {}
