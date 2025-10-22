import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from './roles.enum';

// ✅ ПРАВИЛЬНОЕ МОКИРОВАНИЕ BCRYPT
// Provide mock factory to avoid TDZ ReferenceError for variables used in the factory
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

// Helper to access the mocked compare in tests
const mockCompare = (bcrypt.compare as unknown) as jest.Mock;

// Создаем "заглушки" для зависимостей
const mockUsersService = {
  findOneByEmail: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    // Убираем jest.spyOn из beforeEach

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    // Сбрасываем все моки (включая мок bcrypt) перед каждым тестом
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token on successful login', async () => {
      // Arrange
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const userFromDb = {
        id: 1, email: 'test@example.com', password: 'hashedPassword',
        role: Role.User, orders: [], reviews: []
      } as User;
      const expectedToken = 'mockAccessToken';

      mockUsersService.findOneByEmail.mockResolvedValue(userFromDb);
      mockCompare.mockResolvedValue(true); // Настраиваем мок compare
      mockJwtService.sign.mockReturnValue(expectedToken);

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(result).toEqual({ message: 'Вход выполнен успешно', access_token: expectedToken });
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockCompare).toHaveBeenCalledWith(loginDto.password, userFromDb.password); // Проверяем вызов мока compare
      expect(mockJwtService.sign).toHaveBeenCalledWith({ email: userFromDb.email, sub: userFromDb.id });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      // Arrange
      const loginDto = { email: 'wrong@example.com', password: 'password123' };
      mockUsersService.findOneByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockCompare).not.toHaveBeenCalled(); // compare не должен был вызываться
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      // Arrange
      const loginDto = { email: 'test@example.com', password: 'wrongPassword' };
      const userFromDb = { id: 1, email: 'test@example.com', password: 'hashedPassword', role: Role.User, orders: [], reviews: [] } as User;

      mockUsersService.findOneByEmail.mockResolvedValue(userFromDb);
      mockCompare.mockResolvedValue(false); // compare возвращает false

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockCompare).toHaveBeenCalledWith(loginDto.password, userFromDb.password);
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });
  });
});