import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus, { message: 'Недопустимый статус заказа.' })
  @IsNotEmpty({ message: 'Статус не может быть пустым.' })
  status: OrderStatus;
}