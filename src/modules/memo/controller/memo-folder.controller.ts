import { Body, Controller, Injectable, Post, Get, Param } from '@nestjs/common';
import { RequestCreateMemoFolderDto, ResponseCreateMemoFolderDto } from '../dto/memo-folder/create-memo-folder.dto';
import { CreateMemoFolderService } from '../service/memo-folder/create-memo-folder.service';
import { FindMemoFolderService } from '../service/memo-folder/find-memo-folder.service';
import { MemoFolderDto } from '../dto/memo-folder/memo-folder.dto';
import * as Swagger from '../swagger/memo-folder.swagger';

@Controller('memo-folder')
export class MemoFolderController {
  constructor(
    private readonly createMemoFolderService: CreateMemoFolderService,
    private readonly findMemoFolderService: FindMemoFolderService,
  ) {}

  @Swagger.createMemoFolder('메모 폴더 생성')
  @Post()
  async createMemoFolder(@Body() dto: RequestCreateMemoFolderDto): Promise<ResponseCreateMemoFolderDto> {
    const memoFolder = await this.createMemoFolderService.execute(dto);
    return ResponseCreateMemoFolderDto.from(memoFolder);
  }

  @Swagger.getMemoFolder('메모 폴더 상세조회')
  @Get(':id')
  async findMemoFolder(@Param('id') id: string): Promise<MemoFolderDto> {
    const memoFolder = await this.findMemoFolderService.execute(id);
    return MemoFolderDto.from(memoFolder);
  }
}
