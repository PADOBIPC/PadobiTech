import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { Role } from '../auth/roles.enum';

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
        // UserRepository не нужен напрямую, т.к. User приходит готовый
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    reviewRepository = module.get(getRepositoryToken(Review));
    productRepository = module.get(getRepositoryToken(Product));
    jest.clearAllMocks(); // Сбрасываем моки
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Тесты для create ---
  describe('create', () => {
    const productId = 1;
    const createDto: CreateReviewDto = { rating: 5, comment: 'Great!' };
    const user = { id: 1, email: 'test@test.com', role: Role.User, password:'hash' } as User; // User с паролем
    const product = { id: productId, name: 'Test Prod' } as Product;
    // Данные для create
    const reviewData = {
        rating: createDto.rating,
        comment: createDto.comment,
        product: product,
        user: user,
    };
    // Сохраненный отзыв
    const savedReview = { id: 1, ...reviewData, createdAt: new Date() } as Review;
    // Ожидаемый результат (без пароля user)
    const expectedResult = {
        id: 1,
        rating: createDto.rating,
        comment: createDto.comment,
        product: product,
        user: { id: user.id, email: user.email, role: user.role }, // User БЕЗ пароля
        createdAt: savedReview.createdAt,
    };


    it('should successfully create a review', async () => {
      // Arrange
      productRepository.findOneBy!.mockResolvedValue(product); // Продукт найден
      reviewRepository.create!.mockReturnValue(reviewData as any); // create возвращает данные
      reviewRepository.save!.mockResolvedValue(savedReview); // save возвращает сохраненный объект

      // Act
      const result = await service.create(productId, createDto, user);

      // Assert
      expect(result).toEqual(expectedResult); // Проверяем результат без пароля
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
      productRepository.findOneBy!.mockResolvedValue(null); // Продукт НЕ найден

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
    // Мок отзыва С паролем пользователя (как вернет find)
    const reviewWithUserPassword = {
        id: 1,
        rating: 4,
        comment: 'Okay',
        product: { id: productId },
        user: { id: 1, email: 'test@test.com', password: 'hash' } // Пользователь С паролем
    } as unknown as Review;
     // Ожидаемый результат БЕЗ пароля пользователя
    const expectedReviewWithoutPassword = {
        id: 1,
        rating: 4,
        comment: 'Okay',
        product: { id: productId },
        user: { id: 1, email: 'test@test.com' } // Пользователь БЕЗ пароля
    };


    it('should return an array of reviews for a product without user passwords', async () => {
      // Arrange
      // Мокируем find, чтобы он вернул массив отзывов
      // Здесь find должен возвращать user без пароля из-за опции select в сервисе
       const reviewsFromDb = [{
            id: 1,
            rating: 4,
            comment: 'Okay',
            product: { id: productId },
            user: { id: 1, email: 'test@test.com' } // User БЕЗ пароля
        }] as Review[];
      reviewRepository.find!.mockResolvedValue(reviewsFromDb);

      // Act
      const result = await service.findAllForProduct(productId);

      // Assert
      expect(result).toEqual(reviewsFromDb); // Сравниваем с тем, что вернул find (уже без пароля)
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
        reviewRepository.find!.mockResolvedValue([]); // Find возвращает пустой массив

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

  // --- Тесты для remove (опционально, можно добавить позже) ---
  // describe('remove', () => { ... });

}); // Конец describe('ReviewsService')