import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module'; // Импортируем модуль пользователей
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule, // Чтобы мы могли использовать UsersService
    PassportModule,
    ConfigModule, // Чтобы читать .env
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '60m' }, // Токен будет "жить" 60 минут
      }),
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}