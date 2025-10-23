import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { Product } from '../products/entities/product.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from 'src/core/users/entities/user.entity';
import { Role } from 'src/shared/enums/roles.enum';


// --- Моки Репозиториев ---
type MockRepository<T extends ObjectLiteral> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T extends ObjectLiteral>(): MockRepository<T> => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

describe('ReviewsService', () => {
  let service: ReviewsService;
  let reviewRepository: MockRepository<Review>;
  let productRepository: MockRepository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: getRepositoryToken(Review), useValue: createMockRepository() },
        { provide: getRepositoryToken(Product), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    reviewRepository = module.get(getRepositoryToken(Review));
    productRepository = module.get(getRepositoryToken(Product));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Тесты для create ---
  describe('create', () => {
    const productId = 1;
    const createDto: CreateReviewDto = { rating: 5, comment: 'Great!' };
    const user = { id: 1, email: 'test@test.com', role: Role.User, password:'hash' } as User;
    const product = { id: productId, name: 'Test Prod' } as Product;
    const reviewData = {
        rating: createDto.rating,
        comment: createDto.comment,
        product: product,
        user: user,
    };
    const savedReview = { id: 1, ...reviewData, createdAt: new Date() } as Review;
    const expectedResult = {
        id: 1,
        rating: createDto.rating,
        comment: createDto.comment,
        product: product,
        user: { id: user.id, email: user.email, role: user.role },
        createdAt: savedReview.createdAt,
    };


    it('should successfully create a review', async () => {
      // Arrange
      productRepository.findOneBy!.mockResolvedValue(product);
      reviewRepository.create!.mockReturnValue(reviewData as any);
      reviewRepository.save!.mockResolvedValue(savedReview);

      // Act
      const result = await service.create(productId, createDto, user);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(productRepository.findOneBy).toHaveBeenCalledWith({ id: productId });
      expect(reviewRepository.create).toHaveBeenCalledWith({
        ...createDto,
        product: product,
        user: user,
      });
      expect(reviewRepository.save).toHaveBeenCalledWith(reviewData);
    });

    it('should throw NotFoundException if product not found', async () => {
      // Arrange
      productRepository.findOneBy!.mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(productId, createDto, user)).rejects.toThrow(NotFoundException);
      expect(productRepository.findOneBy).toHaveBeenCalledWith({ id: productId });
      expect(reviewRepository.create).not.toHaveBeenCalled();
      expect(reviewRepository.save).not.toHaveBeenCalled();
    });
  });

  // --- Тесты для findAllForProduct ---
  describe('findAllForProduct', () => {
    const productId = 1;
    const reviewWithUserPassword = {
        id: 1,
        rating: 4,
        comment: 'Okay',
        product: { id: productId },
        user: { id: 1, email: 'test@test.com', password: 'hash' }
    } as unknown as Review;
    const expectedReviewWithoutPassword = {
        id: 1,
        rating: 4,
        comment: 'Okay',
        product: { id: productId },
        user: { id: 1, email: 'test@test.com' }
    };


    it('should return an array of reviews for a product without user passwords', async () => {
      // Arrange
       const reviewsFromDb = [{
            id: 1,
            rating: 4,
            comment: 'Okay',
            product: { id: productId },
            user: { id: 1, email: 'test@test.com' }
        }] as Review[];
      reviewRepository.find!.mockResolvedValue(reviewsFromDb);

      // Act
      const result = await service.findAllForProduct(productId);

      // Assert
      expect(result).toEqual(reviewsFromDb);
      expect(reviewRepository.find).toHaveBeenCalledWith({
        where: { product: { id: productId } },
        relations: ['user'],
        select: {
            user: {
              id: true,
              email: true,
            }
          }
      });
    });

    it('should return an empty array if no reviews found', async () => {
        // Arrange
        reviewRepository.find!.mockResolvedValue([]);

        // Act
        const result = await service.findAllForProduct(productId);

        // Assert
        expect(result).toEqual([]);
        expect(reviewRepository.find).toHaveBeenCalledWith({
          where: { product: { id: productId } },
          relations: ['user'],
          select: { user: { id: true, email: true } }
        });
    });
  });

});