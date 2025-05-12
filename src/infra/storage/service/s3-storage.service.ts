import { MyConfigService } from '@/core/config/my-config.service';
import { StorageContentType } from '@/infra/storage/storage.enum';
import { StorageService } from '@/infra/storage/service/storage.service';
import { UploadParams } from '@/infra/storage/types/storage.type';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3StorageService implements StorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly bucketUrl: string;
  private readonly presignedBucketName: string;

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
    this.presignedBucketName = this.myConfigService.get('AWS_S3_PRESIGNED_BUCKET_NAME');
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

  async getUploadUrl(fileName: string, extension: string): Promise<string> {
    const path = `${fileName}.${extension}`;

    const command = new GetObjectCommand({
      Bucket: this.presignedBucketName,
      Key: path,
      ResponseContentType: this.getContentType(path),
    });

    return getSignedUrl(this.s3Client, command, {
      expiresIn: this.myConfigService.get('AWS_S3_PRESIGNED_URL_EXPIRE'),
    });
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
