import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../auth/roles.enum';

// Мок UsersService
const mockUsersService = {
  create: jest.fn(),
  // findOne: jest.fn(), // findOne вызывается косвенно через req.user
};

// Мок объекта запроса (req) с пользователем
const mockRequest = (user: any) => ({
  user: user,
});

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
    // Мокируем JwtAuthGuard
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create (register)', () => {
    it('should call service.create and return the result', async () => {
      const createDto: CreateUserDto = { email: 'test@test.com', password: 'password' };
      const expectedResult = { id: 1, email: 'test@test.com', role: Role.User } as User; // Без пароля
      mockUsersService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('getProfile (me)', () => {
    it('should return the user object from the request (without password)', async () => {
      // Arrange
      const userFromReq = { id: 1, email: 'test@test.com', role: Role.User } as User; // Пользователь без пароля
      const req = mockRequest(userFromReq);

      // Act
      const result = controller.getProfile(req); // Метод синхронный

      // Assert
      expect(result).toEqual(userFromReq);
      // Проверяем, что сервис не вызывался напрямую
      // expect(service.findOne).not.toHaveBeenCalled();
    });
  });
});