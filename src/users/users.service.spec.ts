import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ObjectLiteral } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../auth/roles.enum';
import { genSalt, hash } from 'bcrypt';

// МОКИРОВАНИЕ BCRYPT

jest.mock('bcrypt', () => {
  const mockGenSalt = jest.fn().mockResolvedValue('randomSalt');
  const mockHash = jest.fn().mockResolvedValue('hashedPassword');
  return {
    genSalt: mockGenSalt,
    hash: mockHash,
  };
});

type MockRepository<T extends ObjectLiteral> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T extends ObjectLiteral>(): MockRepository<T> => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository<User>(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
    
    // Сбрасываем моки репозитория И моки bcrypt перед каждым тестом
    jest.clearAllMocks(); 
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };
    const savedUser = {
        id: 1,
        email: createUserDto.email,
        password: 'hashedPassword', 
        role: Role.User,
        orders: [],
        reviews: [],
    } as User;
     const expectedResult = { 
        id: 1,
        email: createUserDto.email,
        role: Role.User,
        orders: [],
        reviews: [],
    };

    it('should successfully create and return a user without password', async () => {
      // Arrange
      userRepository.findOneBy!.mockResolvedValue(null); 
      userRepository.create!.mockReturnValue({ 
         email: createUserDto.email,
         password: 'hashedPassword',
      });
      userRepository.save!.mockResolvedValue(savedUser); 

      // Act
      const result = await service.create(createUserDto);

      // Assert
      expect(result).toEqual(expectedResult); 
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: createUserDto.email });
      expect((genSalt as jest.Mock)).toHaveBeenCalled(); 
      expect((hash as jest.Mock)).toHaveBeenCalledWith(createUserDto.password, 'randomSalt'); 
      expect(userRepository.create).toHaveBeenCalledWith({
        email: createUserDto.email,
        password: 'hashedPassword',
      });
      expect(userRepository.save).toHaveBeenCalledWith({
         email: createUserDto.email,
         password: 'hashedPassword',
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      // Arrange
      userRepository.findOneBy!.mockResolvedValue(savedUser); 

      // Act & Assert
      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: createUserDto.email });
      expect((hash as jest.Mock)).not.toHaveBeenCalled(); 
      expect(userRepository.create).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
     const userId = 1;
     const userWithPassword = { 
        id: userId,
        email: 'test@example.com',
        password: 'hashedPassword',
        role: Role.User,
        orders: [],
        reviews: [],
    } as User;

    it('should return a user including password if found (for internal use)', async () => {
       // Arrange
       userRepository.findOneBy!.mockResolvedValue(userWithPassword);

       // Act
       const result = await service.findOne(userId);

       // Assert
       expect(result).toEqual(userWithPassword); 
       expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
    });

    it('should throw NotFoundException if user not found', async () => {
       // Arrange
       userRepository.findOneBy!.mockResolvedValue(null);

       // Act & Assert
       await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
       expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
    });
  });

  describe('findOneByEmail', () => {
    const userEmail = 'test@example.com';
    const userWithPassword = { 
        id: 1,
        email: userEmail,
        password: 'hashedPassword',
        role: Role.User,
        orders: [],
        reviews: [],
    } as User;

    it('should return a user including password if found by email (for internal use)', async () => {
       // Arrange
       userRepository.findOneBy!.mockResolvedValue(userWithPassword);

       // Act
       const result = await service.findOneByEmail(userEmail);

       // Assert
       expect(result).toEqual(userWithPassword); 
       expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: userEmail });
    });

    it('should return undefined if user not found by email', async () => {
       // Arrange
       userRepository.findOneBy!.mockResolvedValue(null); 

       // Act
       const result = await service.findOneByEmail(userEmail);

       // Assert
       expect(result).toBeUndefined();
       expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: userEmail });
    });
  });
});