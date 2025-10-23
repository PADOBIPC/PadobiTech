import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateManufacturerDto {
  @ApiProperty({ example: 'NVIDIA', description: 'Название производителя' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'USA', description: 'Страна происхождения' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: 1993, description: 'Год основания' })
  @IsInt()
  @Min(1800)
  foundedYear: number;
}