import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Env } from './env.model';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<Env>);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configurar CORS según el ambiente
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const corsOrigin =
    configService.get('CORS_ORIGIN', { infer: true }) ||
    'https://project-neb-front.vercel.app';

  app.enableCors({
    origin: isDevelopment
      ? (
          _origin: string | undefined,
          callback: (err: Error | null, allow?: boolean) => void,
        ) => callback(null, true) // Permite cualquier origen en desarrollo
      : corsOrigin,
    credentials: true,
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('NEB Backend API')
    .setDescription(
      'API documentation for NEB Backend - Sistema de gestión de jugadores, entrenadores y pagos',
    )
    .setVersion('1.0')
    .addTag('auth', 'Endpoints de autenticación')
    .addTag('users', 'Gestión de usuarios')
    .addTag('players', 'Gestión de jugadores')
    .addTag('coaches', 'Gestión de entrenadores')
    .addTag('categories', 'Gestión de categorías')
    .addTag('payments', 'Gestión de pagos')
    .addTag('tournaments', 'Gestión de torneos')
    .addTag('matches', 'Gestión de partidos')
    .addTag('statistics', 'Gestión de estadísticas')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
