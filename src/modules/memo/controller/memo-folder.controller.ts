import { Body, Controller, Injectable, Post, Get, Param, Put, Delete } from '@nestjs/common';
import { RequestCreateMemoFolderDto, ResponseCreateMemoFolderDto } from '../dto/memo-folder/create-memo-folder.dto';
import { CreateMemoFolderService } from '../service/memo-folder/create-memo-folder.service';
import { FindMemoFolderService } from '../service/memo-folder/find-memo-folder.service';
import { MemoFolderDto } from '../dto/memo-folder/memo-folder.dto';
import * as Swagger from '../swagger/memo-folder.swagger';
import { FindRootMemoFoldersService } from '../service/memo-folder/find-root-memo-folders.service';
import { FindChildMemoFoldersService } from '../service/memo-folder/find-child-memo-folders.service';
import { RequestUpdateMemoFolderDto, ResponseUpdateMemoFolderDto } from '../dto/memo-folder/update-memo-folder.dto';
import { UpdateMemoFolderService } from '../service/memo-folder/update-memo-folder.service';
import { ApiTags } from '@nestjs/swagger';
import { DeleteMemoFolderService } from '../service/memo-folder/delete-memo-folder.service';

@ApiTags('[메모] 폴더')
@Controller('memo-folders')
export class MemoFolderController {
  constructor(
    private readonly createMemoFolderService: CreateMemoFolderService,
    private readonly findMemoFolderService: FindMemoFolderService,
    private readonly findRootMemoFoldersService: FindRootMemoFoldersService,
    private readonly findChildMemoFoldersService: FindChildMemoFoldersService,
    private readonly updateMemoFolderService: UpdateMemoFolderService,
    private readonly deleteMemoFolderService: DeleteMemoFolderService,
  ) {}

  @Swagger.createMemoFolder('메모 폴더 생성')
  @Post()
  async createMemoFolder(@Body() dto: RequestCreateMemoFolderDto): Promise<ResponseCreateMemoFolderDto> {
    const memoFolder = await this.createMemoFolderService.execute(dto);
    return ResponseCreateMemoFolderDto.from(memoFolder);
  }

  @Swagger.updateMemoFolder('메모 폴더 수정')
  @Put(':id')
  async updateMemoFolder(
    @Param('id') id: string,
    @Body() dto: RequestUpdateMemoFolderDto,
  ): Promise<ResponseUpdateMemoFolderDto> {
    const memoFolder = await this.updateMemoFolderService.execute(id, dto);
    return ResponseUpdateMemoFolderDto.from(memoFolder);
  }

  @Swagger.getRootMemoFolders('최상위 메모 폴더 목록 조회')
  @Get('root')
  async getRootMemoFolders(): Promise<MemoFolderDto[]> {
    const memoFolders = await this.findRootMemoFoldersService.execute();
    return memoFolders.map((memoFolder) => MemoFolderDto.from(memoFolder));
  }

  @Swagger.getChildMemoFolders('메모 폴더의 하위 폴더 목록 조회')
  @Get(':id/children')
  async getChildMemoFolders(@Param('id') id: string): Promise<MemoFolderDto[]> {
    const childFolders = await this.findChildMemoFoldersService.execute(id);
    return childFolders.map((folder) => MemoFolderDto.from(folder));
  }

  @Swagger.getMemoFolder('메모 폴더 상세조회')
  @Get(':id')
  async findMemoFolder(@Param('id') id: string): Promise<MemoFolderDto> {
    const memoFolder = await this.findMemoFolderService.execute(id);
    return MemoFolderDto.from(memoFolder);
  }

  @Swagger.deleteMemoFolder('메모 폴더 삭제')
  @Delete(':id')
  async deleteMemoFolder(@Param('id') id: string): Promise<void> {
    await this.deleteMemoFolderService.execute(id);
  }
}
