import { Controller, Get, Inject, Query } from '@nestjs/common';
import * as Swagger from './storage.swagger';
import { RequestGetUploadUrlQuery } from '@/infra/storage/dto/get-upload-url.dto';
import { STORAGE_SERVICE, StorageService } from '@/infra/storage/service/storage.service';

@Controller('storage')
export class StorageController {
  constructor(@Inject(STORAGE_SERVICE) private readonly storageService: StorageService) {}

  @Swagger.getUploadUrl('파일 업로드용 URL 발급')
  @Get('upload-url')
  async getUploadUrl(@Query() { fileName, extension }: RequestGetUploadUrlQuery) {
    const uploadUrl = await this.storageService.getUploadUrl(fileName, extension);
    return { url: uploadUrl };
  }
}
