import { IsString, IsNotEmpty, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Видеокарты', description: 'Название категории' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Устройства для обработки графики', description: 'Описание категории' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 1, description: 'ID связанного производителя' })
  @IsInt()
  @IsNotEmpty()
  manufacturerId: number;
}