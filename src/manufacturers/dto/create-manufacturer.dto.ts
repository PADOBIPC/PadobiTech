import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateManufacturerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsInt()
  @Min(1800)
  foundedYear: number;
}