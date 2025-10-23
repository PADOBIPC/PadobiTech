import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя (уникальный)' })
  @IsEmail({}, { message: 'Пожалуйста, введите корректный email.' })
  @IsNotEmpty({ message: 'Email не может быть пустым.' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Пароль (мин. 6 символов)', minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Пароль должен быть не короче 6 символов.' })
  @IsNotEmpty({ message: 'Пароль не может быть пустым.' })
  password: string;
}