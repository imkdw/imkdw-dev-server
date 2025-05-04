import { Public } from '@/common/decorator/public.decorator';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Public()
  getHello(): string {
    return 'Hello World';
  }
}
