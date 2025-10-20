// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <-- Импортируйте

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ ДОБАВЬТЕ ЭТУ СТРОКУ
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Игнорировать свойства, которых нет в DTO
    transform: true, // Автоматически преобразовывать типы (например, строку '1' в число 1)
    transformOptions: {
      enableImplicitConversion: true, // Необходимо для @Query()
    },
  }));

  await app.listen(3000);
}
bootstrap();