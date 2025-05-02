import { Public } from '@/common/decorator/public.decorator';
import { Roles } from '@/common/decorator/role.decorator';
import { RoleGuard } from '@/common/guards/role.guard';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MemberRole } from 'src/modules/member/member.enum';
import { RequestCreateMemoFolderDto, ResponseCreateMemoFolderDto } from '../dto/memo-folder/create-memo-folder.dto';
import { MemoFolderDto } from '../dto/memo-folder/memo-folder.dto';
import { RequestUpdateMemoFolderDto, ResponseUpdateMemoFolderDto } from '../dto/memo-folder/update-memo-folder.dto';
import { ResponseFindFolderMemosDto } from '../dto/memo/find-folder-memos.dto';
import { CreateMemoFolderService } from '../service/memo-folder/create-memo-folder.service';
import { DeleteMemoFolderService } from '../service/memo-folder/delete-memo-folder.service';
import { FindChildMemoFoldersService } from '../service/memo-folder/find-child-memo-folders.service';
import { FindMemoFolderService } from '../service/memo-folder/find-memo-folder.service';
import { FindRootMemoFoldersService } from '../service/memo-folder/find-root-memo-folders.service';
import { UpdateMemoFolderService } from '../service/memo-folder/update-memo-folder.service';
import { FindFolderMemosService } from '../service/memo/find-folder-memos.service';
import * as MemoFolderSwagger from '../swagger/memo-folder.swagger';
import * as MemoSwagger from '../swagger/memo.swagger';

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
    private readonly deleteMemoFolderService: DeleteMemoFolderService,
    private readonly findFolderMemosService: FindFolderMemosService,
  ) {}

  @MemoFolderSwagger.createMemoFolder('메모 폴더 생성')
  @Post()
  @Roles(MemberRole.ADMIN)
  async createMemoFolder(@Body() dto: RequestCreateMemoFolderDto): Promise<ResponseCreateMemoFolderDto> {
    const memoFolder = await this.createMemoFolderService.execute(dto);
    return ResponseCreateMemoFolderDto.from(memoFolder);
  }

  @MemoFolderSwagger.updateMemoFolder('메모 폴더 수정')
  @Put(':id')
  @Roles(MemberRole.ADMIN)
  async updateMemoFolder(
    @Param('id') id: string,
    @Body() dto: RequestUpdateMemoFolderDto,
  ): Promise<ResponseUpdateMemoFolderDto> {
    const memoFolder = await this.updateMemoFolderService.execute(id, dto);
    return ResponseUpdateMemoFolderDto.from(memoFolder);
  }

  @MemoFolderSwagger.findRootMemoFolders('최상위 메모 폴더 목록 조회')
  @Get('root')
  @Public()
  async getRootMemoFolders(): Promise<MemoFolderDto[]> {
    const memoFolders = await this.findRootMemoFoldersService.execute();
    return memoFolders.map((memoFolder) => MemoFolderDto.from(memoFolder));
  }

  @MemoFolderSwagger.findChildMemoFolders('메모 폴더의 하위 폴더 목록 조회')
  @Get(':id/children')
  @Public()
  async getChildMemoFolders(@Param('id') id: string): Promise<MemoFolderDto[]> {
    const childFolders = await this.findChildMemoFoldersService.execute(id);
    return childFolders.map((folder) => MemoFolderDto.from(folder));
  }

  @MemoSwagger.findFolderMemos('메모 폴더에 속한 메모 목록 조회')
  @Get(':id/memos')
  @Public()
  async getFolderMemos(@Param('id') id: string): Promise<ResponseFindFolderMemosDto> {
    const memos = await this.findFolderMemosService.execute(id);
    return ResponseFindFolderMemosDto.from(memos);
  }

  @MemoFolderSwagger.getMemoFolder('메모 폴더 상세조회')
  @Get(':id')
  @Public()
  async findMemoFolder(@Param('id') id: string): Promise<MemoFolderDto> {
    const memoFolder = await this.findMemoFolderService.execute(id);
    return MemoFolderDto.from(memoFolder);
  }

  @MemoFolderSwagger.deleteMemoFolder('메모 폴더 삭제')
  @Delete(':id')
  @Roles(MemberRole.ADMIN)
  async deleteMemoFolder(@Param('id') id: string): Promise<void> {
    await this.deleteMemoFolderService.execute(id);
  }
}
