import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('메모')
@Controller('memo')
export class MemoController {}
