import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const swaggerConfig = new DocumentBuilder()
  .setTitle('Rainbow')
  .setVersion('1.0')
  .build();

const bootstrap = async () => {
  /**
   * Connect with fastify.
   */
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
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
