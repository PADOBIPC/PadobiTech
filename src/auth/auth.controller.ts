import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth') // Убедитесь, что здесь 'auth'
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login') // Убедитесь, что здесь 'login'
  signIn(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}