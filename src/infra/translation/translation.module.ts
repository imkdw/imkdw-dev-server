import { MyConfigModule } from '@/core/config/my-config.module';
import { TRANSLATION_SERVICE } from '@/infra/translation/translation.enum';
import { Module } from '@nestjs/common';
import { DeepLTranslationService } from 'src/infra/translation/deepl-translation.service';

@Module({
  imports: [MyConfigModule],
  providers: [
    {
      provide: TRANSLATION_SERVICE,
      useClass: DeepLTranslationService,
    },
  ],
  exports: [TRANSLATION_SERVICE],
})
export class TranslationModule {}
