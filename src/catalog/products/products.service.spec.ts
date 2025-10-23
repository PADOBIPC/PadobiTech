import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ObjectLiteral } from 'typeorm';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { NotFoundException } from '@nestjs/common';
import { Manufacturer } from '../manufacturers/entities/manufacturer.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductsDto } from './dto/find-products.dto';

type MockRepository<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
type MockQueryBuilder<T = any> = {
  leftJoinAndSelect: jest.Mock<MockQueryBuilder<T>>;
  andWhere: jest.Mock<MockQueryBuilder<T>>;
  orderBy: jest.Mock<MockQueryBuilder<T>>;
  skip: jest.Mock<MockQueryBuilder<T>>;
  take: jest.Mock<MockQueryBuilder<T>>;
  getManyAndCount: jest.Mock<Promise<[T[], number]>>;
};

const createMockRepository = <T extends ObjectLiteral = any>(): MockRepository<T> => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(),
});

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: MockRepository<Product>;
  let mockQueryBuilder: MockQueryBuilder<Product>;

  beforeEach(async () => {
    mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: createMockRepository<Product>(),
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<MockRepository<Product>>(getRepositoryToken(Product));

    productRepository.createQueryBuilder!.mockReturnValue(mockQueryBuilder as any);
    
    // СБРОС МОКОВ ПЕРЕД КАЖДЫМ ТЕСТОМ
    jest.clearAllMocks(); 
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Тесты для create ---
  describe('create', () => {
    it('should successfully create a product', async () => {
      // Arrange
      const createDto: CreateProductDto = { name: 'Test Product', description: 'Desc', price: 100, stock: 10, manufacturerId: 1, categoryId: 1 };
      const productToSave = { name: createDto.name, description: createDto.description, price: createDto.price, stock: createDto.stock, manufacturer: { id: createDto.manufacturerId }, category: { id: createDto.categoryId } };
      const savedProduct = { id: 1, ...productToSave, reviews: [] } as unknown as Product;

      productRepository.create!.mockReturnValue(productToSave as any);
      productRepository.save!.mockResolvedValue(savedProduct);

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(result).toEqual(savedProduct);
      expect(productRepository.create).toHaveBeenCalledWith(expect.objectContaining({ ...productToSave }));
      expect(productRepository.save).toHaveBeenCalledWith(productToSave);
    });
  });

  // --- Тесты для findAll ---
  describe('findAll', () => {
    it('should return products and count with default options', async () => {
      // Arrange
      const products = [{ id: 1, name: 'ProdA' }] as Product[];
      const count = 1;
      mockQueryBuilder.getManyAndCount.mockResolvedValue([products, count]);
      const query = new FindProductsDto();

      // Act
      const result = await service.findAll(query);

      // Assert
      expect(result).toEqual({ data: products, count: count });
      expect(productRepository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('product.manufacturer', 'manufacturer');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('product.category', 'category');
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('product.id', 'ASC');
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalledTimes(1);
    });

    it('should apply all filters, pagination, and sorting', async () => {
       // Arrange
       const products = [{ id: 2, name: 'ProdB' }] as Product[];
       const count = 5;
       mockQueryBuilder.getManyAndCount.mockResolvedValue([products, count]);
       const query: FindProductsDto = { page: 3, limit: 20, sortBy: 'price', order: 'DESC', manufacturerId: 5, categoryId: 10, search: 'keyword', minPrice: 100, maxPrice: 500 };

       // Act
       const result = await service.findAll(query);

       // Assert
       expect(result).toEqual({ data: products, count: count });
       expect(productRepository.createQueryBuilder).toHaveBeenCalledWith('product');
       expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('product.manufacturerId = :manufacturerId', { manufacturerId: query.manufacturerId });
       expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('product.categoryId = :categoryId', { categoryId: query.categoryId });
       expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('product.price >= :minPrice', { minPrice: query.minPrice });
       expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('product.price <= :maxPrice', { maxPrice: query.maxPrice });
       expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('(product.name LIKE :search OR product.description LIKE :search)', { search: `%${query.search}%` });
       expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('product.price', 'DESC');
       expect(mockQueryBuilder.skip).toHaveBeenCalledWith(40);
       expect(mockQueryBuilder.take).toHaveBeenCalledWith(20);
       expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalledTimes(1);
    });

     it('should allow sorting by manufacturerName', async () => {
        const query: FindProductsDto = { sortBy: 'manufacturerName', order: 'ASC' };
        mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

        await service.findAll(query);

        expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('manufacturer.name', 'ASC');
     });
  });

  // --- Тесты для findOne ---
  describe('findOne', () => {
    it('should return a product if found', async () => {
       const id = 1;
       const product = { id: 1, name: 'TestProd' } as Product;
       productRepository.findOne!.mockResolvedValue(product);

       const result = await service.findOne(id);

       expect(result).toEqual(product);
       expect(productRepository.findOne).toHaveBeenCalledWith({ where: { id }, relations: ['manufacturer', 'category'] });
    });

    it('should throw NotFoundException if product not found', async () => {
       const id = 99;
       productRepository.findOne!.mockResolvedValue(null);

       await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
       expect(productRepository.findOne).toHaveBeenCalledWith({ where: { id }, relations: ['manufacturer', 'category'] });
    });
  });

  // --- Тесты для update ---
  describe('update', () => {
     it('should update a product successfully', async () => {
        const id = 1;
        const updateDto: UpdateProductDto = { stock: 5 };
        const existingProduct = { id: id, name: 'TestProd', stock: 10, save: jest.fn() } as unknown as Product;
        const updatedProductData = { ...existingProduct, ...updateDto };
        const savedProduct = { ...updatedProductData };

        productRepository.preload!.mockResolvedValue(updatedProductData);
        productRepository.save!.mockResolvedValue(savedProduct);

        const result = await service.update(id, updateDto);

        expect(result).toEqual(savedProduct);
        expect(productRepository.preload).toHaveBeenCalledWith({ id, ...updateDto });
        expect(productRepository.save).toHaveBeenCalledWith(updatedProductData);
     });

     it('should throw NotFoundException if product to update not found', async () => {
       const id = 99;
       const updateDto: UpdateProductDto = { stock: 5 };
       productRepository.preload!.mockResolvedValue(null);

       await expect(service.update(id, updateDto)).rejects.toThrow(NotFoundException);
       expect(productRepository.preload).toHaveBeenCalledWith({ id, ...updateDto });
       expect(productRepository.save).not.toHaveBeenCalled();
     });
   });

   // --- Тесты для remove ---
   describe('remove', () => {
     it('should remove a product successfully', async () => {
        const id = 1;
        const productToRemove = { id: id, name: 'TestProd' } as Product;
        const findOneSpy = jest.spyOn(service, 'findOne').mockResolvedValue(productToRemove);
        productRepository.remove!.mockResolvedValue(undefined);

        await service.remove(id);

        expect(findOneSpy).toHaveBeenCalledWith(id);
        expect(productRepository.remove).toHaveBeenCalledWith(productToRemove);
     });

     it('should throw NotFoundException if product to remove not found', async () => {
       const id = 99;
       const findOneSpy = jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

       await expect(service.remove(id)).rejects.toThrow(NotFoundException);
       expect(findOneSpy).toHaveBeenCalledWith(id);
       expect(productRepository.remove).not.toHaveBeenCalled();
     });
   });
});