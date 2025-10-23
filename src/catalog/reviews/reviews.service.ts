import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entities/review.entity';
import { Product } from '../products/entities/product.entity';
import { User } from 'src/core/users/entities/user.entity';
import { Role } from 'src/shared/enums/roles.enum';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(
    productId: number,
    createReviewDto: CreateReviewDto,
    user: User,
  ): Promise<Review> {
    // 1. Проверяем, существует ли продукт
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException(`Продукт с ID ${productId} не найден.`);
    }

    // 2. Создаем отзыв
    const review = this.reviewRepository.create({
      ...createReviewDto,
      product: product,
      user: user,
    });

    // 3. Сохраняем отзыв
    const savedReview = await this.reviewRepository.save(review);

    if (savedReview.user) {
       (savedReview.user as Partial<User>).password = undefined;
    }

    return savedReview;
  }

  async findAllForProduct(productId: number): Promise<Review[]> {
    
    return this.reviewRepository.find({
      where: { product: { id: productId } },
      relations: ['user'],
      select: {
        user: {
          id: true,
          email: true,
        }
      }
    });
  }


  findOne(id: number) {
    return `This action returns a #${id} review`;
  }


  async remove(id: number, currentUser: User): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!review) {
      throw new NotFoundException(`Отзыв с ID ${id} не найден.`);
    }
    if (currentUser.role !== Role.Admin && review.user.id !== currentUser.id) {
      throw new ForbiddenException('У вас нет прав на удаление этого отзыва.');
    }

    await this.reviewRepository.remove(review);
  }
}