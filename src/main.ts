import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

  app.enableCors({
    origin: '*',
  });

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Swagger Configuration
  // const config = new DocumentBuilder().setTitle('ATL Backend API').setDescription('API documentation for ATL Backend').setVersion('1.0').addTag('people').addTag('job-titles').addTag('cct-state').addTag('micro-types').addTag('micro-elements').addTag('micro-analysis-types').addTag('micro-events').addTag('micro-analysis').addTag('influxdb-connections').addTag('influxdb-signals').addTag('data-capture').build();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
