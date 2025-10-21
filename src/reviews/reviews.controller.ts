import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@Controller('products/:productId/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Создание отзыва для конкретного продукта
  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() createReviewDto: CreateReviewDto,
    @Req() req,
  ) {
    const user: User = req.user;
    return this.reviewsService.create(productId, createReviewDto, user);
  }

  // Получение всех отзывов для конкретного продукта
  @Get()
  findAllForProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.reviewsService.findAllForProduct(productId);
  }

  // Удаление отзыва (только авторизованные пользователи)
   @Delete(':id')
   @UseGuards(JwtAuthGuard)
   remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
     const user: User = req.user;
     return this.reviewsService.remove(id, user);
   }

}