// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // <-- Импорты

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ /* ... твои настройки CORS ... */ });
  app.useGlobalPipes(new ValidationPipe({ /* ... твои настройки ValidationPipe ... */ }));

  // ✅ НАСТРОЙКА SWAGGER
  const config = new DocumentBuilder()
    .setTitle('PC Builder API') // Название твоего API
    .setDescription('API для приложения по сборке ПК') // Краткое описание
    .setVersion('1.0') // Версия API
    .addBearerAuth() // Добавляем кнопку для ввода JWT токена
    .build(); // Собираем конфигурацию

  const document = SwaggerModule.createDocument(app, config); // Создаем документ OpenAPI
  SwaggerModule.setup('api-docs', app, document); // Указываем путь (/api-docs), где будет доступна документация

  await app.listen(3000);
  console.log(`Swagger UI available at http://localhost:3000/api-docs`); // Выводим ссылку в консоль
}
bootstrap();