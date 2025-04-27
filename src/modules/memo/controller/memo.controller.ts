import { RequestCreateMemoDto, ResponseCreateMemoDto } from '@/memo/dto/memo/create-memo.dto';
import { CreateMemoService } from '@/memo/service/memo/create-memo.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as Swagger from '../swagger/memo.swagger';

@ApiTags('[메모]')
@Controller('memos')
export class MemoController {
  constructor(private readonly createMemoService: CreateMemoService) {}

  @Swagger.createMemo('메모 생성')
  @Post()
  async create(@Body() dto: RequestCreateMemoDto): Promise<ResponseCreateMemoDto> {
    const createdMemo = await this.createMemoService.execute(dto);
    return ResponseCreateMemoDto.from(createdMemo);
  }
}
