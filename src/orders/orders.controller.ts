import { Controller, Post, Body, UseGuards, Get, Param, Req, Patch, Query, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { FindOrdersDto } from './dto/find-orders.dto'; // Импорт DTO пагинации
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { User } from '../users/entities/user.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard) // Защищаем все роуты заказов
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.User)
  create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    const user: User = req.user;
    return this.ordersService.create(createOrderDto, user);
  }

  // Получение заказов с пагинацией и фильтрами
  @Get()
  findAll(@Req() req, @Query() query: FindOrdersDto) { 
     const user: User = req.user;
     
     // Админ вызывает findAll без user (чтобы видеть все),
     // обычный пользователь - с user (чтобы видеть свои)
     if (user.role === Role.Admin) {
       return this.ordersService.findAll(query); 
     } else {
       // Передаем user в сервис, чтобы он добавил условие where
       return this.ordersService.findAll(query, user); 
     }
  }

  // Получение одного заказа (логика для админа и юзера внутри контроллера)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number | string, @Req() req) {
     const user: User = req.user;
     
     // ensure id is a number when called directly in tests (pipes are bypassed in unit tests)
     const orderId = typeof id === 'string' ? parseInt(id, 10) : id;
     
     if (user.role === Role.Admin) {
       return this.ordersService.findOne(orderId); // Админ ищет без user
     } else {
       return this.ordersService.findOne(orderId, user); // Пользователь ищет со своим user
     }
  }

  // Обновление статуса (только админ)
  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto);
  }
}