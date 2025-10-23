import { Test, TestingModule } from '@nestjs/testing';
import { ProductReviewsController } from './reviews.controller'; 
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entities/review.entity';
import { NotFoundException } from '@nestjs/common';
import { User } from '../../core/users/entities/user.entity';
import { Role } from '../../shared/enums/roles.enum';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard'; 


const mockReviewsService = {
  create: jest.fn(),
  findAllForProduct: jest.fn(),
  remove: jest.fn(),
};

const mockRequest = (user: any) => ({
  user: user,
});


describe('ProductReviewsController', () => { 
  let controller: ProductReviewsController;
  let service: ReviewsService;

  const mockUser = { id: 1, email: 'test@test.com', role: Role.User } as User;
  const productId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductReviewsController], 
      providers: [
        {
          provide: ReviewsService,
          useValue: mockReviewsService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard).useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<ProductReviewsController>(ProductReviewsController); 
    service = module.get<ReviewsService>(ReviewsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => { 
    it('should call service.create with productId, dto and user', async () => {
      const createDto: CreateReviewDto = { rating: 5, comment: 'Great!' };
      const expectedResult = { id: 1, ...createDto } as Review;
      mockReviewsService.create.mockResolvedValue(expectedResult);
      const req = mockRequest(mockUser);

      const result = await controller.create(productId, createDto, req);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(productId, createDto, mockUser);
    });

     it('should throw NotFoundException if service throws it', async () => {
        const createDto: CreateReviewDto = { rating: 5, comment: 'Great!' };
        mockReviewsService.create.mockRejectedValue(new NotFoundException());
        const req = mockRequest(mockUser);
        await expect(controller.create(productId, createDto, req)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllForProduct', () => {
    it('should call service.findAllForProduct with productId', async () => {
      const expectedResult = [{ id: 1, rating: 5 }] as Review[];
      mockReviewsService.findAllForProduct.mockResolvedValue(expectedResult);

      const result = await controller.findAllForProduct(productId);

      expect(result).toEqual(expectedResult);
      expect(service.findAllForProduct).toHaveBeenCalledWith(productId);
    });
  });

}); // Конец describe