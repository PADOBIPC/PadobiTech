// src/products/dto/find-products.dto.ts
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min, IsString, IsIn } from 'class-validator';

export class FindProductsDto {
  // Пагинация
  @IsOptional()
  @Type(() => Number) // Преобразуем строку в число
  @IsInt()
  @Min(1)
  page?: number = 1; // Значение по умолчанию

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10; // Значение по умолчанию

  // Сортировка
  @IsOptional()
  @IsString()
  sortBy?: string = 'id'; // Поле для сортировки по умолчанию

  @IsOptional()
  @IsIn(['ASC', 'DESC']) // Допустимые значения
  order?: 'ASC' | 'DESC' = 'ASC'; // Порядок сортировки по умолчанию

  // Фильтрация
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  manufacturerId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;
}