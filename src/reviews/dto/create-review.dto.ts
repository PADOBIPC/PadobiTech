import { IsString, IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsInt({ message: 'Рейтинг должен быть целым числом.' })
  @Min(1, { message: 'Минимальный рейтинг - 1.' })
  @Max(5, { message: 'Максимальный рейтинг - 5.' })
  @IsNotEmpty({ message: 'Рейтинг обязателен.' })
  rating: number;

  @IsString({ message: 'Комментарий должен быть строкой.' })
  @IsNotEmpty({ message: 'Комментарий не может быть пустым.' })
  comment: string;
}