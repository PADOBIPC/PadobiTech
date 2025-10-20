// src/orders/orders.controller.ts
import { Controller, Post, Body, UseGuards, Get, Param, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { User } from '../users/entities/user.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard) // Защищаем все роуты заказов - только для авторизованных
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Создание заказа (доступно для роли User)
  @Post()
  @UseGuards(RolesGuard) // Добавляем проверку ролей
  @Roles(Role.User)       // Только User может создавать заказ
  create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    const user: User = req.user; // Получаем пользователя из запроса (добавлен JwtStrategy)
    return this.ordersService.create(createOrderDto, user);
  }

  // Получение всех заказов текущего пользователя
  @Get()
  findAll(@Req() req) {
     const user: User = req.user;
     return this.ordersService.findAll(user);
  }

  // Получение конкретного заказа текущего пользователя
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
     const user: User = req.user;
     return this.ordersService.findOne(+id, user);
  }
}