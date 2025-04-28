import { RequestCreateMemoDto, ResponseCreateMemoDto } from '@/memo/dto/memo/create-memo.dto';
import { ResponseGetMemoDto } from '@/memo/dto/memo/get-memo.dto';
import { CreateMemoService } from '@/memo/service/memo/create-memo.service';
import { GetMemoService } from '@/memo/service/memo/get-memo.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as Swagger from '../swagger/memo.swagger';

@ApiTags('[메모]')
@Controller('memos')
export class MemoController {
  constructor(
    private readonly createMemoService: CreateMemoService,
    private readonly getMemoService: GetMemoService,
  ) {}

  @Swagger.createMemo('메모 생성')
  @Post()
  async create(@Body() dto: RequestCreateMemoDto): Promise<ResponseCreateMemoDto> {
    const createdMemo = await this.createMemoService.execute(dto);
    return ResponseCreateMemoDto.from(createdMemo);
  }

  @Swagger.getMemo('메모 상세정보 조회')
  @Get(':slug')
  async getMemo(@Param('slug') slug: string): Promise<ResponseGetMemoDto> {
    const memo = await this.getMemoService.execute(slug);
    return ResponseGetMemoDto.from(memo);
  }
}
