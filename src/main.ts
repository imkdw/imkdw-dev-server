import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Versioning
   * @example /api/v1/memo-folder
   */
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  /**
   * Validation
   */
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  /**
   * Swagger
   */
  const config = new DocumentBuilder().setTitle('IMKDW Dev API').setVersion('1.0.0').build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 4000);
}

bootstrap();
