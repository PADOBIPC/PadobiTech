import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsString, IsIn, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindProductsDto {
  @ApiPropertyOptional({ description: 'Номер страницы', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Количество элементов на странице', default: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Поле для сортировки', default: 'id', enum: ['id', 'name', 'price', 'stock', 'manufacturerName', 'categoryName'] })
  @IsOptional()
  @IsString()
  sortBy?: string = 'id';

  @ApiPropertyOptional({ description: 'Порядок сортировки', default: 'ASC', enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC' = 'ASC';

  @ApiPropertyOptional({ description: 'Фильтр по ID производителя' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  manufacturerId?: number;

  @ApiPropertyOptional({ description: 'Фильтр по ID категории' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  @ApiPropertyOptional({ description: 'Текст для поиска по названию/описанию' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Минимальная цена', type: 'number', format: 'float', minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Максимальная цена', type: 'number', format: 'float', minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;
}