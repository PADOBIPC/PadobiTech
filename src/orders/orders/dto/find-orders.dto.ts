import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsString, IsIn, IsEnum } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindOrdersDto {
  @ApiPropertyOptional({ description: 'Номер страницы', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Кол-во элементов на странице', default: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Поле для сортировки', default: 'createdAt', enum: ['id', 'createdAt', 'totalAmount', 'status', 'userEmail'] })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ description: 'Порядок сортировки', default: 'DESC', enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({ description: 'Фильтр по статусу заказа', enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({ description: 'Фильтр по ID пользователя (только для админа)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;
}