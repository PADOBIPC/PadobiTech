import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { User } from 'src/core/users/entities/user.entity';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';

@ApiTags('Products / Reviews', 'Reviews')
@Controller('products/:productId/reviews')
export class ProductReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a review to a product (Authenticated users only)' })
  @ApiParam({ name: 'productId', description: 'ID of the product being reviewed', type: Number })
  @ApiResponse({ status: 201, description: 'Review added successfully.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  create(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() createReviewDto: CreateReviewDto,
    @Req() req,
  ) {
    const user: User = req.user;
    return this.reviewsService.create(productId, createReviewDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews for a specific product' })
  @ApiParam({ name: 'productId', description: 'ID of the product', type: Number })
  @ApiResponse({ status: 200, description: 'List of reviews.'})
  findAllForProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.reviewsService.findAllForProduct(productId);
  }
}

@ApiTags('Reviews') // Отдельная группа в Swagger
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}


  @Delete(':id')
  @UseGuards(JwtAuthGuard) // Нужен токен
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a review (Admin or Author only)' })
  @ApiParam({ name: 'id', description: 'Review ID', type: Number })
  @ApiResponse({ status: 200, description: 'Review deleted successfully.'})
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' }) // Если не админ и не автор
  @ApiResponse({ status: 404, description: 'Review Not Found.' })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const user: User = req.user;
    await this.reviewsService.remove(id, user);
    // Обычно DELETE возвращает 204 No Content или 200 OK без тела
    // Можно вернуть { message: 'Deleted' } для ясности
    return { message: 'Review deleted successfully' };
  }

}