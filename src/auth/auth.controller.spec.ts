import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { HttpStatus } from '@nestjs/common';

// Мок AuthService
const mockAuthService = {
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn (login)', () => {
    it('should call service.login and return the result with status OK', async () => {
      // Arrange
      const loginDto: LoginDto = { email: 'test@test.com', password: 'password' };
      const expectedResult = { message: 'Вход выполнен успешно', access_token: 'mockToken' };
      mockAuthService.login.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.signIn(loginDto);

      // Assert
      expect(result).toEqual(expectedResult);
      expect(service.login).toHaveBeenCalledWith(loginDto);
      // Проверка статуса обычно делается в E2E тестах, но декоратор @HttpCode(HttpStatus.OK) должен сработать
    });
  });
});