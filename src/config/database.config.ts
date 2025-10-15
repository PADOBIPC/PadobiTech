import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot(); // Загружаем переменные из .env

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // Ключевые опции для стабильной работы
  autoLoadEntities: true, 
  synchronize: true, // В разработке это создаст таблицы за нас
};