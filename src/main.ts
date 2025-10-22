import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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