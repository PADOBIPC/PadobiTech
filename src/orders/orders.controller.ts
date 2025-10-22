import { Controller, Post, Body, UseGuards, Get, Param, Req, Patch, Query, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { FindOrdersDto } from './dto/find-orders.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { User } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrderStatus } from './entities/order.entity';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.User)
  @ApiOperation({ summary: 'Create a new order (User only)' })
  @ApiResponse({ status: 201, description: 'Order created successfully.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 400, description: 'Bad Request (e.g., insufficient stock).'})
  create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    const user: User = req.user;
    return this.ordersService.create(createOrderDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get orders (User sees own, Admin sees based on query)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String, enum: ['id', 'createdAt', 'totalAmount', 'status', 'userEmail'] })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
  @ApiQuery({ name: 'userId', required: false, type: Number, description: 'Admin only filter' })
  @ApiResponse({ status: 200, description: 'List of orders.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAll(@Req() req, @Query() query: FindOrdersDto) {
     const user: User = req.user;
     if (user.role === Role.Admin) {
       return this.ordersService.findAll(query);
     } else {
       return this.ordersService.findAll(query, user);
     }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific order by ID (User sees own, Admin sees any)' })
  @ApiParam({ name: 'id', description: 'Order ID', type: Number })
  @ApiResponse({ status: 200, description: 'Order details.'})
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
     const user: User = req.user;
     if (user.role === Role.Admin) {
       return this.ordersService.findOne(id);
     } else {
       return this.ordersService.findOne(id, user);
     }
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update order status (Admin only)' })
  @ApiParam({ name: 'id', description: 'Order ID', type: Number })
  @ApiResponse({ status: 200, description: 'Status updated successfully.'})
  @ApiResponse({ status: 404, description: 'Not Found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, updateOrderStatusDto);
  }
}