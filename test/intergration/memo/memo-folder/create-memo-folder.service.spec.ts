import { ClsPrismaModule } from '@/config/cls-prisma.module';
import { DuplicateMemoFolderNameException } from '@/memo/domain/memo-folder/exception/duplicate-memo-folder-name.exception';
import { MEMO_FOLDER_REPOSITORY } from '@/memo/domain/memo-folder/repository';
import { PrismaMemoFolderRepository } from '@/memo/domain/memo-folder/repository/prisma-memo-folder.repository';
import { RequestCreateMemoFolderDto } from '@/memo/dto/memo-folder/create-memo-folder.dto';
import { CreateMemoFolderService } from '@/memo/service/memo-folder/create-memo-folder.service';
import { MemoFolderValidator } from '@/memo/validator/memo-folder.validator';
import { Test } from '@nestjs/testing';

describe(CreateMemoFolderService.name, () => {
  let sut: CreateMemoFolderService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ClsPrismaModule],
      providers: [
        MemoFolderValidator,
        {
          provide: MEMO_FOLDER_REPOSITORY,
          useClass: PrismaMemoFolderRepository,
        },
        CreateMemoFolderService,
      ],
    }).compile();

    sut = module.get<CreateMemoFolderService>(CreateMemoFolderService);
  });

  describe('기존 폴더명과 중복되는 경우', () => {
    const existFolderName = 'test';
    it('예외가 발생한다', async () => {
      const dto: RequestCreateMemoFolderDto = {
        name: existFolderName,
        parentId: null,
      };

      await expect(sut.execute(dto)).rejects.toThrow(DuplicateMemoFolderNameException);
    });
  });
});
