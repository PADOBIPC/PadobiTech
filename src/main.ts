import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

// --- 1. Настройка CORS ---
  app.enableCors({
    origin: 'http://localhost:3001', // Замени на URL твоего фронтенда
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Разрешает передачу cookies/заголовков авторизации
  });

  // --- 2. Глобальный ValidationPipe ---
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Игнорировать свойства в запросе, которых нет в DTO
    forbidNonWhitelisted: true, // (Опционально) Выдавать ошибку, если есть лишние свойства
    transform: true, // Автоматически преобразовывать типы
    transformOptions: {
      enableImplicitConversion: true, // Разрешает неявное преобразование для @Query()/@Param()
    },
  }));

  // НАСТРОЙКА SWAGGER
  const config = new DocumentBuilder()
    .setTitle('PC Builder API')
    .setDescription('API для приложения по сборке ПК')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
  console.log(`Swagger UI available at http://localhost:3000/api-docs`);
}
bootstrap();