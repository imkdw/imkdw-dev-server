import { Global, Module, Provider } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaMemoFolderRepository } from '@/infra/persistence/repository/prisma-memo-folder.repository';
import { MEMO_FOLDER_REPOSITORY } from '@/memo/domain/memo-folder/memo-folder.repository';
import { MEMO_REPOSITORY } from '@/memo/domain/memo/memo.repository';
import { PrismaMemoRepository } from '@/infra/persistence/repository/prisma-memo.repository';
import { MEMBER_REPOSITORY } from '@/member/domain/member/member.repository';
import { PrismaMemberRepository } from '@/infra/persistence/repository/prisma-member.repository';

const REPOSITORIES: Provider[] = [
  {
    provide: MEMO_FOLDER_REPOSITORY,
    useClass: PrismaMemoFolderRepository,
  },
  {
    provide: MEMO_REPOSITORY,
    useClass: PrismaMemoRepository,
  },
  {
    provide: MEMBER_REPOSITORY,
    useClass: PrismaMemberRepository,
  },
];

@Global()
@Module({
  providers: [PrismaService, ...REPOSITORIES],
  exports: [PrismaService, ...REPOSITORIES],
})
export class PersistenceModule {}
