import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';

// Мок для CategoriesService
const mockCategoriesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the result', async () => {
      const createDto: CreateCategoryDto = { name: 'Test', description: 'Desc', manufacturerId: 1 };
      const expectedResult = { id: 1, ...createDto } as unknown as Category;
      mockCategoriesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return the result', async () => {
      const expectedResult = [{ id: 1, name: 'Test' }] as Category[];
      mockCategoriesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne and return the result', async () => {
      const id = '1';
      const expectedResult = { id: 1, name: 'Test' } as Category;
      mockCategoriesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(+id);
    });

     it('should throw NotFoundException if service throws it', async () => {
        const id = '99';
        mockCategoriesService.findOne.mockRejectedValue(new NotFoundException());
        await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should call service.update and return the result', async () => {
      const id = '1';
      const updateDto: UpdateCategoryDto = { description: 'New Desc' };
      const expectedResult = { id: 1, name: 'Test', description: 'New Desc' } as Category;
      mockCategoriesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(+id, updateDto);
    });

     it('should throw NotFoundException if service throws it', async () => {
        const id = '99';
        const updateDto: UpdateCategoryDto = { description: 'New Desc' };
        mockCategoriesService.update.mockRejectedValue(new NotFoundException());
        await expect(controller.update(id, updateDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should call service.remove and return the result', async () => {
      const id = '1';
      mockCategoriesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(id);

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(+id);
    });

     it('should throw NotFoundException if service throws it', async () => {
        const id = '99';
        mockCategoriesService.remove.mockRejectedValue(new NotFoundException());
        await expect(controller.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});