import { generateUUID } from '@/common/utils/string.util';
import { MyConfigService } from '@/core/config/my-config.service';
import { StorageContentType } from '@/infra/storage/storage.enum';
import { StorageService } from '@/infra/storage/storage.service';
import { GeneratePathParams, UploadParams } from '@/infra/storage/storage.type';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3StorageService implements StorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly bucketUrl: string;

  constructor(private readonly myConfigService: MyConfigService) {
    this.s3Client = new S3Client({
      region: this.myConfigService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.myConfigService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.myConfigService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.bucketName = this.myConfigService.get('AWS_S3_BUCKET_NAME');
    this.bucketUrl = this.myConfigService.get('AWS_S3_BUCKET_URL');
  }

  async upload({ file, path }: UploadParams): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: path,
      Body: file,
      ContentType: this.getContentType(path),
    });

    await this.s3Client.send(command);

    return `${this.bucketUrl}/${path}`;
  }

  generatePath(params: GeneratePathParams[], extension: string): string {
    const path = params.reduce((acc, param) => `${acc}/${param.prefix}/${param.id}`, '').slice(1);

    return `${path}/${generateUUID()}.${extension}`.replaceAll('//', '/');
  }

  private getContentType(path: string): StorageContentType {
    const extension = path.split('.').pop();

    switch (extension) {
      case 'jpeg':
      case 'jpg':
        return StorageContentType.IMAGE_JPEG;
      case 'png':
        return StorageContentType.IMAGE_PNG;
      case 'webp':
        return StorageContentType.IMAGE_WEBP;
      default:
        return StorageContentType.PLAIN_TEXT;
    }
  }
}
