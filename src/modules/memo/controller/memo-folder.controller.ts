import { Public } from '@/common/decorator/public.decorator';
import { Roles } from '@/common/decorator/role.decorator';
import { RoleGuard } from '@/common/guards/role.guard';
import { MemberRole } from '@/member/member.enum';
import { RequestCreateMemoFolderDto, ResponseCreateMemoFolderDto } from '@/memo/dto/memo-folder/create-memo-folder.dto';
import { MemoFolderDto } from '@/memo/dto/memo-folder/memo-folder.dto';
import { RequestUpdateMemoFolderDto } from '@/memo/dto/memo-folder/update-memo-folder.dto';
import { RequestUpdateMemoFolderNameDto } from '@/memo/dto/memo-folder/update-memo-folder-name.dto';
import { MemoItemDto } from '@/memo/dto/memo/memo-item.dto';
import { CreateMemoFolderService } from '@/memo/service/memo-folder/create-memo-folder.service';
import { DeleteMemoFolderService } from '@/memo/service/memo-folder/delete-memo-folder.service';
import { FindChildMemoFoldersService } from '@/memo/service/memo-folder/find-child-memo-folders.service';
import { FindMemoFolderService } from '@/memo/service/memo-folder/find-memo-folder.service';
import { FindRootMemoFoldersService } from '@/memo/service/memo-folder/find-root-memo-folders.service';
import { UpdateMemoFolderService } from '@/memo/service/memo-folder/update-memo-folder.service';
import { UpdateMemoFolderNameService } from '@/memo/service/memo-folder/update-memo-folder-name.service';
import { FindFolderMemosService } from '@/memo/service/memo/find-folder-memos.service';
import * as Swagger from '@/memo/swagger/memo-folder.swagger';
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

@ApiTags('[메모] 폴더')
@Controller('memo-folders')
@UseGuards(RoleGuard)
export class MemoFolderController {
  constructor(
    private readonly createMemoFolderService: CreateMemoFolderService,
    private readonly findMemoFolderService: FindMemoFolderService,
    private readonly findRootMemoFoldersService: FindRootMemoFoldersService,
    private readonly findChildMemoFoldersService: FindChildMemoFoldersService,
    private readonly updateMemoFolderService: UpdateMemoFolderService,
    private readonly updateMemoFolderNameService: UpdateMemoFolderNameService,
    private readonly deleteMemoFolderService: DeleteMemoFolderService,
    private readonly findFolderMemosService: FindFolderMemosService,
  ) {}

  @Swagger.createMemoFolder('메모 폴더 생성')
  @Post()
  @Roles(MemberRole.ADMIN)
  async createMemoFolder(@Body() dto: RequestCreateMemoFolderDto): Promise<ResponseCreateMemoFolderDto> {
    const memoFolder = await this.createMemoFolderService.execute(dto);
    return ResponseCreateMemoFolderDto.from(memoFolder);
  }

  @Swagger.updateMemoFolder('메모 폴더 수정')
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(MemberRole.ADMIN)
  async updateMemoFolder(@Param('id') id: string, @Body() dto: RequestUpdateMemoFolderDto): Promise<void> {
    await this.updateMemoFolderService.execute(id, dto);
  }

  @Swagger.updateMemoFolderName('메모 폴더 이름 변경')
  @Patch(':id/name')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(MemberRole.ADMIN)
  async updateMemoFolderName(@Param('id') id: string, @Body() dto: RequestUpdateMemoFolderNameDto): Promise<void> {
    await this.updateMemoFolderNameService.execute(id, dto);
  }

  @Swagger.findRootMemoFolders('최상위 메모 폴더 목록 조회')
  @Get('root')
  @Public()
  async getRootMemoFolders(): Promise<MemoFolderDto[]> {
    const memoFolders = await this.findRootMemoFoldersService.execute();
    return memoFolders.map((memoFolder) => MemoFolderDto.from(memoFolder));
  }

  @Swagger.findChildMemoFolders('메모 폴더의 하위 폴더 목록 조회')
  @Get(':id/children')
  @Public()
  async getChildMemoFolders(@Param('id') id: string): Promise<MemoFolderDto[]> {
    const childFolders = await this.findChildMemoFoldersService.execute(id);
    return childFolders.map((folder) => MemoFolderDto.from(folder));
  }

  @Swagger.findFolderMemos('메모 폴더에 속한 메모 목록 조회')
  @Get(':id/memos')
  @Public()
  async getFolderMemos(@Param('id') id: string): Promise<MemoItemDto[]> {
    const memos = await this.findFolderMemosService.execute(id);
    return memos.map((memo) => MemoItemDto.from(memo));
  }

  @Swagger.getMemoFolder('메모 폴더 상세조회')
  @Get(':id')
  @Public()
  async findMemoFolder(@Param('id') id: string): Promise<MemoFolderDto> {
    const memoFolder = await this.findMemoFolderService.execute(id);
    return MemoFolderDto.from(memoFolder);
  }

  @Swagger.deleteMemoFolder('메모 폴더 삭제')
  @Delete(':id')
  @Roles(MemberRole.ADMIN)
  async deleteMemoFolder(@Param('id') id: string): Promise<void> {
    await this.deleteMemoFolderService.execute(id);
  }
}
