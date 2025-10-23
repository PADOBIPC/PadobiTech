import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus, description: 'Новый статус заказа' })
  @IsEnum(OrderStatus, { message: 'Недопустимый статус заказа.' })
  @IsNotEmpty({ message: 'Статус не может быть пустым.' })
  status: OrderStatus;
}