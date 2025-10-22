// src/orders/dto/find-orders.dto.ts
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsString, IsIn, IsEnum } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class FindOrdersDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt'; // По умолчанию сортируем по дате создания

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC'; // По умолчанию самые новые сначала

  // Фильтры (опционально)
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number; // Для админа, чтобы фильтровать по пользователю
}