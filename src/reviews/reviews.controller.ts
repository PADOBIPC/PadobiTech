import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Products / Reviews')
@Controller('products/:productId/reviews')
export class ReviewsController {
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