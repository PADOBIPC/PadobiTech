// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './roles.enum';
import { ROLES_KEY } from './roles.decorator';
import { User } from '../users/entities/user.entity'; // Импортируем User

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Получаем роли, необходимые для доступа, из декоратора @Roles
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // Если роли не указаны в декораторе - доступ разрешен всем
    if (!requiredRoles) {
      return true;
    }
    // Получаем объект пользователя, который JwtAuthGuard добавил в запрос
    const { user }: { user: User } = context.switchToHttp().getRequest();

    // Проверяем, есть ли у пользователя хотя бы одна из требуемых ролей
    return requiredRoles.some((role) => user.role === role);
  }
}