import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { FindOrdersDto } from './dto/find-orders.dto';
import { Order, OrderStatus } from './entities/order.entity';

import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { User } from 'src/core/users/entities/user.entity';
import { Role } from 'src/shared/enums/roles.enum';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';

const mockOrdersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  updateStatus: jest.fn(),
};

const mockRequest = (user: any) => ({
  user: user,
});

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockUser = { id: 1, email: 'user@test.com', role: Role.User } as User;
  const mockAdmin = { id: 2, email: 'admin@test.com', role: Role.Admin } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard).useValue({ canActivate: jest.fn(() => true) })
    .overrideGuard(RolesGuard).useValue({ canActivate: jest.fn(() => true) })
    .compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with user and dto', async () => {
      const createDto: CreateOrderDto = { shippingAddress: 'Addr', items: [] };
      const expectedResult = { id: 1 } as Order;
      mockOrdersService.create.mockResolvedValue(expectedResult);
      const req = mockRequest(mockUser);

      const result = await controller.create(createDto, req);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto, mockUser);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with query and user for regular user', async () => {
      const query = new FindOrdersDto();
      const expectedResult = { data: [], count: 0 };
      mockOrdersService.findAll.mockResolvedValue(expectedResult);
      const req = mockRequest(mockUser);

      const result = await controller.findAll(req, query);

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(query, mockUser);
    });

    it('should call service.findAll with query only for admin', async () => {
        const query = new FindOrdersDto();
        const expectedResult = { data: [], count: 0 };
        mockOrdersService.findAll.mockResolvedValue(expectedResult);
        const req = mockRequest(mockAdmin);

        const result = await controller.findAll(req, query);

        expect(result).toEqual(expectedResult);
        expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    const orderId = '1';

    it('should call service.findOne with id and user for regular user', async () => {
      const expectedResult = { id: 1 } as Order;
      mockOrdersService.findOne.mockResolvedValue(expectedResult);
      const req = mockRequest(mockUser);

      const result = await controller.findOne(+orderId, req);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(+orderId, mockUser);
    });

     it('should call service.findOne with id only for admin', async () => {
      const expectedResult = { id: 1 } as Order;
      mockOrdersService.findOne.mockResolvedValue(expectedResult);
      const req = mockRequest(mockAdmin);

      const result = await controller.findOne(+orderId, req);

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(+orderId);
    });

     it('should throw NotFoundException if service throws it', async () => {
        const req = mockRequest(mockUser);
        mockOrdersService.findOne.mockRejectedValue(new NotFoundException());
        await expect(controller.findOne(+orderId, req)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
      it('should call service.updateStatus with id and dto (for admin)', async () => {
          const id = '1';
          const updateDto: UpdateOrderStatusDto = { status: OrderStatus.SHIPPED };
          const expectedResult = { id: 1, status: OrderStatus.SHIPPED } as Order;
          mockOrdersService.updateStatus.mockResolvedValue(expectedResult);

          const result = await controller.updateStatus(+id, updateDto);

          expect(result).toEqual(expectedResult);
          expect(service.updateStatus).toHaveBeenCalledWith(+id, updateDto);
      });

       it('should throw NotFoundException if service throws it', async () => {
          const id = '99';
          const updateDto: UpdateOrderStatusDto = { status: OrderStatus.SHIPPED };
          mockOrdersService.updateStatus.mockRejectedValue(new NotFoundException());
          await expect(controller.updateStatus(+id, updateDto)).rejects.toThrow(NotFoundException);
      });
  });
});