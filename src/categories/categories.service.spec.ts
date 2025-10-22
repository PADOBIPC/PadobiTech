import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ObjectLiteral } from 'typeorm';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { NotFoundException } from '@nestjs/common';
import { Manufacturer } from '../manufacturers/entities/manufacturer.entity';
import { CreateCategoryDto } from './dto/create-category.dto'; // Import DTOs
import { UpdateCategoryDto } from './dto/update-category.dto';

type MockRepository<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T extends ObjectLiteral = any>(): MockRepository<T> => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  preload: jest.fn(), // Needed for update in service logic
  remove: jest.fn(),
  merge: jest.fn(), // Needed for update in service logic
});

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoryRepository: MockRepository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: createMockRepository<Category>(),
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoryRepository = module.get<MockRepository<Category>>(getRepositoryToken(Category));
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a category', async () => {
      const createDto: CreateCategoryDto = {
        name: 'Test Category',
        description: 'Test Desc',
        manufacturerId: 1,
      };
      // Данные, которые мы ожидаем получить от repository.create И передать в repository.save
       const categoryToSave = {
           name: createDto.name,
           description: createDto.description,
           manufacturer: { id: createDto.manufacturerId }, // Включаем manufacturer
       };
       // Результат, который вернет repository.save
       const savedCategory = {
         id: 1,
         ...categoryToSave,
         products: [],
       } as unknown as Category;

      // Мок create возвращает объект, который пойдет в save
      categoryRepository.create!.mockReturnValue(categoryToSave as any); 
      // Мок save возвращает финальный сохраненный объект
      categoryRepository.save!.mockResolvedValue(savedCategory);

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(result).toEqual(savedCategory);
      // Проверяем, что create был вызван правильно внутри сервиса
       expect(categoryRepository.create).toHaveBeenCalledWith(expect.objectContaining({
          name: createDto.name,
          description: createDto.description,
          manufacturer: { id: createDto.manufacturerId },
       }));
       // Проверяем, что save был вызван с результатом вызова create
      expect(categoryRepository.save).toHaveBeenCalledWith(categoryToSave); 
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const categoriesArray = [{ id: 1, name: 'CatA' }, { id: 2, name: 'CatB' }] as Category[];
      categoryRepository.find!.mockResolvedValue(categoriesArray);

      const result = await service.findAll();

      expect(result).toEqual(categoriesArray);
      expect(categoryRepository.find).toHaveBeenCalledWith({ relations: ['manufacturer', 'products'] });
    });
  });

  describe('findOne', () => {
    it('should return a category if found', async () => {
      const id = 1;
      const category = { id: 1, name: 'TestCat' } as Category;
      categoryRepository.findOne!.mockResolvedValue(category);

      const result = await service.findOne(id);

      expect(result).toEqual(category);
      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['manufacturer', 'products'],
      });
    });

    it('should throw NotFoundException if category not found', async () => {
      const id = 99;
      categoryRepository.findOne!.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const id = 1;
    const updateDto: UpdateCategoryDto = { description: 'New Desc' };
    const existingCategory = { 
      id: id, 
      name: 'Old Name', 
      description: 'Old Desc',
      manufacturer: { id: 1 } as Manufacturer,
      products: [],
      save: jest.fn(), // Мок для save на сущности
    } as unknown as Category; 
    const mergedCategory = { ...existingCategory, ...updateDto }; // После merge
    const savedCategory = { ...mergedCategory }; // Финальный результат


    it('should update a category successfully', async () => {
      // Arrange
      // 1. findOne должен вернуть существующую категорию
      categoryRepository.findOne!.mockResolvedValue(existingCategory); 
      
      // 2. merge модифицирует existingCategory (имитируем)
      categoryRepository.merge!.mockImplementation((target, source) => Object.assign(target, source));
      
      // 3. save возвращает финальный результат
      categoryRepository.save!.mockResolvedValue(savedCategory);

      // Act
      const result = await service.update(id, updateDto);

      // Assert
      expect(result).toEqual(savedCategory); 
      // Проверяем, что findOne был вызван для поиска
      expect(categoryRepository.findOne).toHaveBeenCalledWith({ 
        where: { id },
      });
      // Проверяем, что merge был вызван
      expect(categoryRepository.merge).toHaveBeenCalledWith(existingCategory, { description: updateDto.description });
      // Проверяем, что save был вызван с измененным объектом
      expect(categoryRepository.save).toHaveBeenCalledWith(existingCategory); 
    });

    it('should throw NotFoundException if category to update not found', async () => {
      // Arrange
      const notFoundId = 99;
      // findOne возвращает null
      categoryRepository.findOne!.mockResolvedValue(null); 

      // Act & Assert
      await expect(service.update(notFoundId, updateDto)).rejects.toThrow(NotFoundException);
      
      // Проверяем, что findOne был вызван
      expect(categoryRepository.findOne).toHaveBeenCalledWith({ 
        where: { id: notFoundId },
      });
      
      // Убеждаемся, что merge и save НЕ были вызваны
      expect(categoryRepository.merge).not.toHaveBeenCalled();
      expect(categoryRepository.save).not.toHaveBeenCalled(); 
    });
  });

   describe('remove', () => {
     it('should remove a category successfully', async () => {
       const id = 1;
       const categoryToRemove = { id: id, name: 'TestCat' } as Category;
       categoryRepository.findOne!.mockResolvedValue(categoryToRemove); // findOne finds the category
       categoryRepository.remove!.mockResolvedValue(undefined); // remove succeeds

       await service.remove(id);

       expect(categoryRepository.findOne).toHaveBeenCalledWith({ // Check findOne call
          where: { id },
          relations: ['manufacturer', 'products'],
       });
       expect(categoryRepository.remove).toHaveBeenCalledWith(categoryToRemove);
     });

     it('should throw NotFoundException if category to remove not found', async () => {
       const id = 99;
       categoryRepository.findOne!.mockResolvedValue(null); // findOne fails

       await expect(service.remove(id)).rejects.toThrow(NotFoundException);
       expect(categoryRepository.remove).not.toHaveBeenCalled();
     });
   });
});