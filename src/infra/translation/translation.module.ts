import { Module } from '@nestjs/common';
import { DeepLTranslationService } from 'src/infra/translation/deepl-translation.service';
import { TRANSLATION_SERVICE } from 'src/infra/translation/translation.const';

@Module({
  providers: [
    {
      provide: TRANSLATION_SERVICE,
      useClass: DeepLTranslationService,
    },
  ],
  exports: [TRANSLATION_SERVICE],
})
export class TranslationModule {}
