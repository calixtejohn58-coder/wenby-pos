import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {

  const app =
    await NestFactory.create(
      AppModule,
    );

  app.enableCors({

    origin: true,

    credentials: true,

    methods:
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',

    allowedHeaders:
      'Content-Type, Accept, Authorization',
  });

  const config =
    new DocumentBuilder()

      .setTitle(
        'Wenby POS API',
      )

      .setDescription(
        'POS Backend API',
      )

      .setVersion('1.0')

      .addBearerAuth()

      .build();

  const document =
    SwaggerModule.createDocument(
      app,
      config,
    );

  SwaggerModule.setup(
    'api',
    app,
    document,
  );

  await app.listen(
    process.env.PORT || 3000,
  );

  console.log(
    'Backend running',
  );
}

bootstrap();