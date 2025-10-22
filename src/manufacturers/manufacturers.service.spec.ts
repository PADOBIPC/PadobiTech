import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ObjectLiteral } from 'typeorm';
import { ManufacturersService } from './manufacturers.service';
import { Manufacturer } from './entities/manufacturer.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';



// Используем тот же тип и фабрику для мок-репозитория
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
      // Arrange (Подготовка)
      const createDto: CreateManufacturerDto = {
        name: 'TestCorp',
        country: 'Testland',
        foundedYear: 2000,
      };
      // Ожидаемый результат после сохранения (с id)
      const expectedResult = {
        id: 1,
        ...createDto,
        categories: [], // Добавляем пустые массивы для связей
        products: [],
      } as Manufacturer;

      // Настраиваем моки:
      // Метод create репозитория просто возвращает объект на основе DTO
      manufacturerRepository.create!.mockReturnValue(createDto as any); 
      // Метод save репозитория имитирует добавление id базой данных
      manufacturerRepository.save!.mockResolvedValue(expectedResult); 

      // Act (Действие)
      const result = await service.create(createDto);

      // Assert (Проверка)
      expect(result).toEqual(expectedResult); // Результат совпадает с ожидаемым
      expect(manufacturerRepository.create).toHaveBeenCalledWith(createDto); // create был вызван с DTO
      expect(manufacturerRepository.save).toHaveBeenCalledWith(createDto); // save был вызван с объектом, созданным create
    });

    // Можно добавить тест на ошибку (например, если имя уже существует -
    // для этого findOneBy должен вернуть существующего пользователя, а save - выбросить ошибку)
    // it('should throw an error if manufacturer name already exists', async () => { ... });
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
       // Используем findOne, а не findOneBy, так как в сервисе используется findOne
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
       manufacturerRepository.findOne!.mockResolvedValue(null); // findOne вернет null

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

        // preload найдет существующую запись
        manufacturerRepository.preload!.mockResolvedValue(updatedManufacturer); 
        // save сохранит обновленную запись
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
        manufacturerRepository.preload!.mockResolvedValue(null); // preload вернет null

        // Act & Assert
        await expect(service.update(id, updateDto)).rejects.toThrow(NotFoundException);
        expect(manufacturerRepository.preload).toHaveBeenCalledWith({ id, ...updateDto });
        expect(manufacturerRepository.save).not.toHaveBeenCalled(); // save не должен был вызываться
     });
  });

  describe('remove', () => {
     it('should remove a manufacturer successfully', async () => {
        // Arrange
        const id = 1;
        const manufacturerToRemove = { id: id, name: 'TestCorp' } as Manufacturer;
        // findOne должен найти запись для удаления
        manufacturerRepository.findOne!.mockResolvedValue(manufacturerToRemove); 
        // remove просто выполняется (ничего не возвращает)
        manufacturerRepository.remove!.mockResolvedValue(undefined); 

        // Act
        await service.remove(id);

        // Assert
        // Сначала проверяем, что findOne был вызван для поиска
        expect(manufacturerRepository.findOne).toHaveBeenCalledWith({
           where: { id },
           relations: ['categories', 'products'],
         }); 
        // Потом проверяем, что remove был вызван с найденной сущностью
        expect(manufacturerRepository.remove).toHaveBeenCalledWith(manufacturerToRemove);
     });

      it('should throw NotFoundException if manufacturer to remove not found', async () => {
        // Arrange
        const id = 99;
        manufacturerRepository.findOne!.mockResolvedValue(null); // findOne вернет null

        // Act & Assert
        await expect(service.remove(id)).rejects.toThrow(NotFoundException);
         expect(manufacturerRepository.findOne).toHaveBeenCalledWith({
           where: { id },
           relations: ['categories', 'products'],
         }); 
        expect(manufacturerRepository.remove).not.toHaveBeenCalled(); // remove не должен был вызываться
     });
  });

}); // Конец describe('ManufacturersService')