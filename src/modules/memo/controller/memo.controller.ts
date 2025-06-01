import { Public } from '@/common/decorator/public.decorator';
import { Roles } from '@/common/decorator/role.decorator';
import { RoleGuard } from '@/common/guards/role.guard';
import { MemberRole } from '@/member/member.enum';
import { RequestCreateMemoDto, ResponseCreateMemoDto } from '@/memo/dto/memo/create-memo.dto';
import { MemoDetailDto } from '@/memo/dto/memo/memo-detail';
import { RequestUpdateMemoDto } from '@/memo/dto/memo/update-memo.dto';
import { CreateMemoService } from '@/memo/service/memo/create-memo.service';
import { DeleteMemoService } from '@/memo/service/memo/delete-memo.service';
import { GetMemoService } from '@/memo/service/memo/get-memo.service';
import { UpdateMemoService } from '@/memo/service/memo/update-memo.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as Swagger from '../swagger/memo.swagger';
import { RequestUpdateMemoNameDto } from '@/memo/dto/memo/update-memo-name.dto';
import { UpdateMemoNameService } from '@/memo/service/memo/update-memo-name.service';

@ApiTags('[메모]')
@Controller('memos')
@UseGuards(RoleGuard)
export class MemoController {
  constructor(
    private readonly createMemoService: CreateMemoService,
    private readonly getMemoService: GetMemoService,
    private readonly updateMemoService: UpdateMemoService,
    private readonly deleteMemoService: DeleteMemoService,
    private readonly updateMemoNameService: UpdateMemoNameService,
  ) {}

  @Swagger.createMemo('메모 생성')
  @Post()
  @Roles(MemberRole.ADMIN)
  async create(@Body() dto: RequestCreateMemoDto): Promise<ResponseCreateMemoDto> {
    const createdMemo = await this.createMemoService.execute(dto);
    return ResponseCreateMemoDto.from(createdMemo);
  }

  @Swagger.getMemo('메모 상세정보 조회')
  @Get(':slug')
  @Public()
  async getMemo(@Param('slug') slug: string): Promise<MemoDetailDto> {
    const memo = await this.getMemoService.execute(slug);
    return MemoDetailDto.from(memo);
  }

  @Swagger.updateMemo('메모 수정')
  @Put(':slug')
  @Roles(MemberRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateMemo(@Param('slug') slug: string, @Body() dto: RequestUpdateMemoDto): Promise<void> {
    await this.updateMemoService.execute(slug, dto);
  }

  @Swagger.updateMemoName('메모 이름 수정')
  @Patch(':slug/name')
  @Roles(MemberRole.ADMIN)
  async updateMemoName(@Param('slug') slug: string, @Body() dto: RequestUpdateMemoNameDto): Promise<MemoDetailDto> {
    const updatedMemo = await this.updateMemoNameService.execute(slug, dto);
    return MemoDetailDto.from(updatedMemo);
  }

  @Swagger.deleteMemo('메모 삭제')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':slug')
  @Roles(MemberRole.ADMIN)
  async deleteMemo(@Param('slug') slug: string): Promise<void> {
    await this.deleteMemoService.execute(slug);
  }
}
