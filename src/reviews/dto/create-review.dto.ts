import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'Оценка от 1 до 5', minimum: 1, maximum: 5, example: 5 })
  @IsInt({ message: 'Рейтинг должен быть целым числом.' })
  @Min(1, { message: 'Минимальный рейтинг - 1.' })
  @Max(5, { message: 'Максимальный рейтинг - 5.' })
  @IsNotEmpty({ message: 'Рейтинг обязателен.' })
  rating: number;

  @ApiProperty({ description: 'Текст комментария', example: 'Отличный товар!' })
  @IsString({ message: 'Комментарий должен быть строкой.' })
  @IsNotEmpty({ message: 'Комментарий не может быть пустым.' })
  comment: string;
}