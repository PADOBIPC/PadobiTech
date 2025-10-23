import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductsDto } from './dto/find-products.dto';
import { Product } from './entities/product.entity';
import { NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';

const mockProductsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    })
    // Мокируем Guards, чтобы они всегда пропускали запросы в юнит-тестах
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .overrideGuard(RolesGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the result', async () => {
      const createDto: CreateProductDto = { name: 'Test', description: 'Desc', price: 10, stock: 5, manufacturerId: 1, categoryId: 1 };
      const expectedResult = { id: 1, ...createDto } as unknown as Product;
      mockProductsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with query params and return the result', async () => {
      const query = new FindProductsDto();
      query.page = 2;
      const expectedResult = { data: [{ id: 1, name: 'Test' }] as Product[], count: 1 };
      mockProductsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne and return the result', async () => {
      const id = '1';
      const expectedResult = { id: 1, name: 'Test' } as Product;
      mockProductsService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(+id);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(+id);
    });

     it('should throw NotFoundException if service throws it', async () => {
        const id = '99';
        mockProductsService.findOne.mockRejectedValue(new NotFoundException());
        await expect(controller.findOne(+id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should call service.update and return the result', async () => {
      const id = '1';
      const updateDto: UpdateProductDto = { stock: 20 };
      const expectedResult = { id: 1, name: 'Test', stock: 20 } as Product;
      mockProductsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(+id, updateDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(+id, updateDto);
    });

     it('should throw NotFoundException if service throws it', async () => {
        const id = '99';
        const updateDto: UpdateProductDto = { stock: 20 };
        mockProductsService.update.mockRejectedValue(new NotFoundException());
        await expect(controller.update(+id, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should call service.remove and return the result', async () => {
      const id = '1';
      mockProductsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(+id);

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(+id);
    });

     it('should throw NotFoundException if service throws it', async () => {
        const id = '99';
        mockProductsService.remove.mockRejectedValue(new NotFoundException());
        await expect(controller.remove(+id)).rejects.toThrow(NotFoundException);
    });
  });
});