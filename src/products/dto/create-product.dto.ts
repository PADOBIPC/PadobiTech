import { IsString, IsNotEmpty, IsInt, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsInt()
  @IsNotEmpty()
  manufacturerId: number;

  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}