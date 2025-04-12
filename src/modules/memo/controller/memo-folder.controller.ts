import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { RequestCreateMemoFolderDto, ResponseCreateMemoFolderDto } from '../dto/memo-folder/create-memo-folder.dto';
import { CreateMemoFolderService } from '../service/memo-folder/create-memo-folder.service';

@Controller('memo-folder')
export class MemoFolderController {
  constructor(private readonly createMemoFolderService: CreateMemoFolderService) {}

  @Post()
  async createMemoFolder(@Body() dto: RequestCreateMemoFolderDto): Promise<ResponseCreateMemoFolderDto> {
    const memoFolder = await this.createMemoFolderService.execute(dto);
    return ResponseCreateMemoFolderDto.from(memoFolder);
  }
}
