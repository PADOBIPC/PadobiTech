import { IsArray, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({ description: 'ID продукта', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ description: 'Количество продукта', example: 2, minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: '123 Main St, Kyiv', description: 'Адрес доставки' })
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @ApiProperty({ type: [OrderItemDto], description: 'Список позиций заказа' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}