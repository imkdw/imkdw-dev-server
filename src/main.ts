import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

function printBootMessage(port: number) {
  const message = `Running on port: ${port}`;
  const greenColor = '\x1b[32m\x1b[1m%s\x1b[0m';

  // biome-ignore lint/suspicious/noConsole: 서버 구동 확인용 로그 메세지 출력
  console.log(greenColor, `${message.padEnd(message.length)}`);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['warn', 'error', 'debug'],
  });

  /**
   * Versioning
   * @example /v1/memo-folder
   */
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  /**
   * Validation
   */
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  /**
   * CORS
   */
  app.enableCors({ origin: true, credentials: true });

  /**
   * Swagger
   */
  const config = new DocumentBuilder().setTitle('IMKDW Dev API').setVersion('1.0.0').build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    jsonDocumentUrl: '/api-json',
    swaggerOptions: {
      defaultModelsExpandDepth: -1, // 하단 schema 숨김처리
      filter: true, // 검색 활성화
    },
  });

  await app.listen(process.env.PORT!);

  printBootMessage(+process.env.PORT!);
}

bootstrap();
