import { Test, TestingModule } from '@nestjs/testing';
import { ManufacturersController } from './manufacturers.controller';
import { ManufacturersService } from './manufacturers.service';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { Manufacturer } from './entities/manufacturer.entity';
import { NotFoundException } from '@nestjs/common';

const mockManufacturersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ManufacturersController', () => {
  let controller: ManufacturersController;
  let service: ManufacturersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManufacturersController],
      providers: [
        {
          provide: ManufacturersService,
          useValue: mockManufacturersService,
        },
      ],
    }).compile();

    controller = module.get<ManufacturersController>(ManufacturersController);
    service = module.get<ManufacturersService>(ManufacturersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- Тесты для create ---
  describe('create', () => {
    it('should call service.create and return the result', async () => {
      // Arrange
      const createDto: CreateManufacturerDto = { name: 'Test', country: 'Testland', foundedYear: 2000 };
      const expectedResult = { id: 1, ...createDto } as Manufacturer;
      mockManufacturersService.create.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.create(createDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  // --- Тесты для findAll ---
  describe('findAll', () => {
    it('should call service.findAll and return the result', async () => {
      // Arrange
      const expectedResult = [{ id: 1, name: 'Test' }] as Manufacturer[];
      mockManufacturersService.findAll.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith();
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  // --- Тесты для findOne ---
  describe('findOne', () => {
    it('should call service.findOne and return the result', async () => {
      // Arrange
      const id = '1';
      const expectedResult = { id: 1, name: 'Test' } as Manufacturer;
      mockManufacturersService.findOne.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.findOne(+id);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(+id);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException if service throws it', async () => {
        // Arrange
        const id = '99';
        mockManufacturersService.findOne.mockRejectedValue(new NotFoundException());

        // Act & Assert
        await expect(controller.findOne(+id)).rejects.toThrow(NotFoundException);
        expect(service.findOne).toHaveBeenCalledWith(+id);
    });
  });

  // --- Тесты для update ---
  describe('update', () => {
      it('should call service.update and return the result', async () => {
          // Arrange
          const id = '1';
          const updateDto: UpdateManufacturerDto = { country: 'Newland' };
          const expectedResult = { id: 1, name: 'Test', country: 'Newland' } as Manufacturer;
          mockManufacturersService.update.mockResolvedValue(expectedResult);

          // Act
          const result = await controller.update(+id, updateDto);

          // Assert
          expect(result).toEqual(expectedResult);
          expect(service.update).toHaveBeenCalledWith(+id, updateDto);
          expect(service.update).toHaveBeenCalledTimes(1);
      });

       it('should throw NotFoundException if service throws it', async () => {
        // Arrange
        const id = '99';
        const updateDto: UpdateManufacturerDto = { country: 'Newland' };
        mockManufacturersService.update.mockRejectedValue(new NotFoundException());

        // Act & Assert
        await expect(controller.update(+id, updateDto)).rejects.toThrow(NotFoundException);
        expect(service.update).toHaveBeenCalledWith(+id, updateDto);
    });
  });

  // --- Тесты для remove ---
  describe('remove', () => {
      it('should call service.remove and return the result', async () => {
          // Arrange
          const id = '1';
          mockManufacturersService.remove.mockResolvedValue(undefined);

          // Act
          const result = await controller.remove(+id);

          // Assert
          expect(result).toBeUndefined();
          expect(service.remove).toHaveBeenCalledWith(+id);
          expect(service.remove).toHaveBeenCalledTimes(1);
      });

       it('should throw NotFoundException if service throws it', async () => {
        // Arrange
        const id = '99';
        mockManufacturersService.remove.mockRejectedValue(new NotFoundException());

        // Act & Assert
        await expect(controller.remove(+id)).rejects.toThrow(NotFoundException);
        expect(service.remove).toHaveBeenCalledWith(+id);
    });
  });

});