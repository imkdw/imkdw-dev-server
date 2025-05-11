import { AxiosHttpService } from '@/infra/http/axios-http.service';
import { HTTP_SERVICE } from '@/infra/http/http.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    {
      provide: HTTP_SERVICE,
      useClass: AxiosHttpService,
    },
  ],
  exports: [HTTP_SERVICE],
})
export class HttpModule {}
