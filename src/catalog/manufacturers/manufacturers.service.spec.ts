import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ObjectLiteral } from 'typeorm';
import { ManufacturersService } from './manufacturers.service';
import { Manufacturer } from './entities/manufacturer.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';



type MockRepository<T extends ObjectLiteral = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T extends ObjectLiteral = any>(): MockRepository<T> => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
});

describe('ManufacturersService', () => {
  let service: ManufacturersService;
  let manufacturerRepository: MockRepository<Manufacturer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ManufacturersService,
        {
          provide: getRepositoryToken(Manufacturer),
          useValue: createMockRepository<Manufacturer>(),
        },
      ],
    }).compile();

    service = module.get<ManufacturersService>(ManufacturersService);
    manufacturerRepository = module.get<MockRepository<Manufacturer>>(getRepositoryToken(Manufacturer));
  });

  // --- Базовый тест ---
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Заготовки для тестов методов ---
  describe('create', () => {
    it('should successfully create a manufacturer', async () => {
      // Arrange
      const createDto: CreateManufacturerDto = {
        name: 'TestCorp',
        country: 'Testland',
        foundedYear: 2000,
      };
      const expectedResult = {
        id: 1,
        ...createDto,
        categories: [],
        products: [],
      } as Manufacturer;

      manufacturerRepository.create!.mockReturnValue(createDto as any); 
      manufacturerRepository.save!.mockResolvedValue(expectedResult); 

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(manufacturerRepository.create).toHaveBeenCalledWith(createDto);
      expect(manufacturerRepository.save).toHaveBeenCalledWith(createDto); 
    });

  });

  describe('findAll', () => {
    it('should return an array of manufacturers', async () => {
      // Arrange
      const manufacturersArray = [
        { id: 1, name: 'CorpA', country: 'A', foundedYear: 1990, categories: [], products: [] },
        { id: 2, name: 'CorpB', country: 'B', foundedYear: 1995, categories: [], products: [] },
      ] as Manufacturer[];
      manufacturerRepository.find!.mockResolvedValue(manufacturersArray); // Настраиваем мок find

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(manufacturersArray);
      expect(manufacturerRepository.find).toHaveBeenCalledWith({ relations: ['categories', 'products'] }); // Проверяем вызов с relations
    });
  });

 describe('findOne', () => {
    it('should return a manufacturer if found', async () => {
       // Arrange
       const id = 1;
       const manufacturer = { id: id, name: 'TestCorp', country: 'Testland', foundedYear: 2000, categories: [], products: [] } as Manufacturer;
       manufacturerRepository.findOne!.mockResolvedValue(manufacturer); 

       // Act
       const result = await service.findOne(id);

       // Assert
       expect(result).toEqual(manufacturer);
       expect(manufacturerRepository.findOne).toHaveBeenCalledWith({
         where: { id },
         relations: ['categories', 'products'],
       });
    });

    it('should throw NotFoundException if manufacturer not found', async () => {
       // Arrange
       const id = 99;
       manufacturerRepository.findOne!.mockResolvedValue(null);

       // Act & Assert
       await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
       expect(manufacturerRepository.findOne).toHaveBeenCalledWith({
         where: { id },
         relations: ['categories', 'products'],
       });
    });
  });

  describe('update', () => {
     it('should update a manufacturer successfully', async () => {
        // Arrange
        const id = 1;
        const updateDto: UpdateManufacturerDto = { country: 'Newland' };
        const existingManufacturer = { id: id, name: 'TestCorp', country: 'Testland', foundedYear: 2000 } as Manufacturer;
        const updatedManufacturer = { ...existingManufacturer, ...updateDto };

        manufacturerRepository.preload!.mockResolvedValue(updatedManufacturer); 
        manufacturerRepository.save!.mockResolvedValue(updatedManufacturer); 

        // Act
        const result = await service.update(id, updateDto);

        // Assert
        expect(result).toEqual(updatedManufacturer);
        expect(manufacturerRepository.preload).toHaveBeenCalledWith({ id, ...updateDto });
        expect(manufacturerRepository.save).toHaveBeenCalledWith(updatedManufacturer);
     });

      it('should throw NotFoundException if manufacturer to update not found', async () => {
        // Arrange
        const id = 99;
        const updateDto: UpdateManufacturerDto = { country: 'Newland' };
        manufacturerRepository.preload!.mockResolvedValue(null);

        // Act & Assert
        await expect(service.update(id, updateDto)).rejects.toThrow(NotFoundException);
        expect(manufacturerRepository.preload).toHaveBeenCalledWith({ id, ...updateDto });
        expect(manufacturerRepository.save).not.toHaveBeenCalled();
     });
  });

  describe('remove', () => {
     it('should remove a manufacturer successfully', async () => {
        // Arrange
        const id = 1;
        const manufacturerToRemove = { id: id, name: 'TestCorp' } as Manufacturer;
        manufacturerRepository.findOne!.mockResolvedValue(manufacturerToRemove); 
        manufacturerRepository.remove!.mockResolvedValue(undefined); 

        // Act
        await service.remove(id);

        // Assert
        expect(manufacturerRepository.findOne).toHaveBeenCalledWith({
           where: { id },
           relations: ['categories', 'products'],
         }); 
        expect(manufacturerRepository.remove).toHaveBeenCalledWith(manufacturerToRemove);
     });

      it('should throw NotFoundException if manufacturer to remove not found', async () => {
        // Arrange
        const id = 99;
        manufacturerRepository.findOne!.mockResolvedValue(null);

        // Act & Assert
        await expect(service.remove(id)).rejects.toThrow(NotFoundException);
         expect(manufacturerRepository.findOne).toHaveBeenCalledWith({
           where: { id },
           relations: ['categories', 'products'],
         }); 
        expect(manufacturerRepository.remove).not.toHaveBeenCalled();
     });
  });

});