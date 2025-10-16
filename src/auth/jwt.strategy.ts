import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
// ✅ ИСПРАВЛЕННЫЙ ПУТЬ:
import { User } from '../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') ?? '', // Ensure it's always a string
    });
  }

  async validate(payload: { sub: number; email: string }): Promise<User> {
    // Find user including password for Passport compatibility
    const user = await this.usersService['userRepository'].findOneBy({ id: payload.sub });
    if (!user) {
      throw new UnauthorizedException('Доступ запрещен.');
    }
    return user;
  }
}