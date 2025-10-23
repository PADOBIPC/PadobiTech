import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ObjectLiteral } from 'typeorm';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { NotFoundException } from '@nestjs/common';
import { Manufacturer } from '../manufacturers/entities/manufacturer.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

type MockRepository<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T extends ObjectLiteral = any>(): MockRepository<T> => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
  merge: jest.fn(),
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
    jest.clearAllMocks();
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

       const categoryToSave = {
           name: createDto.name,
           description: createDto.description,
           manufacturer: { id: createDto.manufacturerId },
       };
      
       const savedCategory = {
         id: 1,
         ...categoryToSave,
         products: [],
       } as unknown as Category;

      categoryRepository.create!.mockReturnValue(categoryToSave as any); 
      categoryRepository.save!.mockResolvedValue(savedCategory);

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(result).toEqual(savedCategory);
       expect(categoryRepository.create).toHaveBeenCalledWith(expect.objectContaining({
          name: createDto.name,
          description: createDto.description,
          manufacturer: { id: createDto.manufacturerId },
       }));
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
      save: jest.fn(),
    } as unknown as Category; 
    const mergedCategory = { ...existingCategory, ...updateDto };
    const savedCategory = { ...mergedCategory };


    it('should update a category successfully', async () => {
      // Arrange
      categoryRepository.findOne!.mockResolvedValue(existingCategory); 
      
      categoryRepository.merge!.mockImplementation((target, source) => Object.assign(target, source));
      
      categoryRepository.save!.mockResolvedValue(savedCategory);

      // Act
      const result = await service.update(id, updateDto);

      // Assert
      expect(result).toEqual(savedCategory); 
      expect(categoryRepository.findOne).toHaveBeenCalledWith({ 
        where: { id },
      });
      expect(categoryRepository.merge).toHaveBeenCalledWith(existingCategory, { description: updateDto.description });
      expect(categoryRepository.save).toHaveBeenCalledWith(existingCategory); 
    });

    it('should throw NotFoundException if category to update not found', async () => {
      // Arrange
      const notFoundId = 99;
      categoryRepository.findOne!.mockResolvedValue(null); 

      // Act & Assert
      await expect(service.update(notFoundId, updateDto)).rejects.toThrow(NotFoundException);

      expect(categoryRepository.findOne).toHaveBeenCalledWith({ 
        where: { id: notFoundId },
      });
      
      expect(categoryRepository.merge).not.toHaveBeenCalled();
      expect(categoryRepository.save).not.toHaveBeenCalled(); 
    });
  });

   describe('remove', () => {
     it('should remove a category successfully', async () => {
       const id = 1;
       const categoryToRemove = { id: id, name: 'TestCat' } as Category;
       categoryRepository.findOne!.mockResolvedValue(categoryToRemove);
       categoryRepository.remove!.mockResolvedValue(undefined);

       await service.remove(id);

       expect(categoryRepository.findOne).toHaveBeenCalledWith({
          where: { id },
          relations: ['manufacturer', 'products'],
       });
       expect(categoryRepository.remove).toHaveBeenCalledWith(categoryToRemove);
     });

     it('should throw NotFoundException if category to remove not found', async () => {
       const id = 99;
       categoryRepository.findOne!.mockResolvedValue(null);

       await expect(service.remove(id)).rejects.toThrow(NotFoundException);
       expect(categoryRepository.remove).not.toHaveBeenCalled();
     });
   });
});