import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Product } from '../products/entities/product.entity';
import { User } from 'src/core/users/entities/user.entity';
import { ReviewsService } from './reviews.service';
import { ProductReviewsController, ReviewsController } from './reviews.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Product, User]),
  ],
  controllers: [ReviewsController, ProductReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}