import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService, // Убедитесь, что этот сервис внедрен
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    // 1. Находим пользователя
    const user = await this.usersService.findOneByEmail(email);

    // 2. Сравниваем пароли
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    // 3. ✅ СОЗДАЕМ И ВОЗВРАЩАЕМ ТОКЕН
    const payload = { email: user.email, sub: user.id };
    return {
      message: 'Вход выполнен успешно',
      access_token: this.jwtService.sign(payload),
    };
  }
}