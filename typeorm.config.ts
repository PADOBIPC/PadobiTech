// typeorm.config.ts (в корне проекта!)

import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Загружаем переменные окружения из .env
ConfigModule.forRoot({
  envFilePath: '.env', 
});

const configService = new ConfigService();

const config: DataSourceOptions = {
  type: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  
  // Указываем, где искать ваши Entity файлы
  entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
  
  // Указываем, где будут лежать файлы миграций
  migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
  
  // Отключаем опасную синхронизацию
  synchronize: false,
};

export default new DataSource(config);