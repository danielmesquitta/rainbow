import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'node:fs';
import { join } from 'node:path';
import { AppModule } from './app.module';

const swaggerConfig = new DocumentBuilder()
  .setTitle('Rainbow')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const bootstrap = async () => {
  const appConfig = {
    logger: true,
  };

  if (process.env.NODE_ENV === 'production') {
    const rootDir = join(__dirname, '../..');

    const httpsOptions = {
      key: fs.readFileSync(join(rootDir, 'private.key')),
      cert: fs.readFileSync(join(rootDir, 'certificate.crt')),
    };

    Object.assign(appConfig, { https: httpsOptions });
  }

  /**
   * Connect with fastify.
   */
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(appConfig),
  );

  /**
   * Enable cors.
   */
  app.enableCors({
    origin: process.env.CORS_ORIGIN ? JSON.parse(process.env.CORS_ORIGIN) : '*',
    credentials: true,
  });

  /**
   * Run validations.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  /**
   * Apply transform to all responses.
   */
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  /**
   * Run swagger.
   */
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, document, {
    customCss: '.swagger-ui .renderedMarkdown code { color: #3B4151; }',
  });

  /**
   * Run app.
   */
  await app.listen(process.env.PORT || 3000, process.env.HOST || '0.0.0.0');
};

bootstrap();
