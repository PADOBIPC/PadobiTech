import { IsString, IsNotEmpty, IsInt, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'GeForce RTX 4090', description: 'Название продукта' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Флагманская видеокарта', description: 'Описание продукта' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 1599.99, description: 'Цена продукта', type: 'number', format: 'float' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 50, description: 'Количество на складе' })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 1, description: 'ID производителя' })
  @IsInt()
  @IsNotEmpty()
  manufacturerId: number;

  @ApiProperty({ example: 1, description: 'ID категории' })
  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}