import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Role } from '../../shared/enums/roles.enum';

// МОКИРОВАНИЕ BCRYPT
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

const mockCompare = (bcrypt.compare as unknown) as jest.Mock;

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
      mockCompare.mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(expectedToken);

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(result).toEqual({ message: 'Вход выполнен успешно', access_token: expectedToken });
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockCompare).toHaveBeenCalledWith(loginDto.password, userFromDb.password);
      expect(mockJwtService.sign).toHaveBeenCalledWith({ email: userFromDb.email, sub: userFromDb.id });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      // Arrange
      const loginDto = { email: 'wrong@example.com', password: 'password123' };
      mockUsersService.findOneByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockCompare).not.toHaveBeenCalled();
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      // Arrange
      const loginDto = { email: 'test@example.com', password: 'wrongPassword' };
      const userFromDb = { id: 1, email: 'test@example.com', password: 'hashedPassword', role: Role.User, orders: [], reviews: [] } as User;

      mockUsersService.findOneByEmail.mockResolvedValue(userFromDb);
      mockCompare.mockResolvedValue(false);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(mockUsersService.findOneByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(mockCompare).toHaveBeenCalledWith(loginDto.password, userFromDb.password);
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });
  });
});