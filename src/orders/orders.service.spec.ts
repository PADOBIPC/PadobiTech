import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner, ObjectLiteral } from 'typeorm';
import { OrdersService } from './orders.service';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { FindOrdersDto } from './dto/find-orders.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Role } from '../auth/roles.enum';

// --- Моки Репозиториев ---
type MockRepository<T extends ObjectLiteral> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T extends ObjectLiteral>(): MockRepository<T> => ({
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
  createQueryBuilder: jest.fn(), // Needed for findAll with pagination
});

// --- Моки Транзакций ---
// Тип для мока QueryRunner и его менеджера
type MockQueryRunner = Partial<Record<Exclude<keyof QueryRunner, 'manager'>, jest.Mock>> & {
  manager: {
    findOne: jest.Mock;
    save: jest.Mock;
    create: jest.Mock;
  };
};
// Тип для мока DataSource
type MockDataSource = Partial<Record<keyof DataSource, jest.Mock>> & {
  createQueryRunner: jest.Mock<MockQueryRunner>;
};

// --- Мок QueryBuilder для findAll ---
type MockOrderQueryBuilder = {
  leftJoinAndSelect: jest.Mock<MockOrderQueryBuilder>;
  andWhere: jest.Mock<MockOrderQueryBuilder>;
  orderBy: jest.Mock<MockOrderQueryBuilder>;
  skip: jest.Mock<MockOrderQueryBuilder>;
  take: jest.Mock<MockOrderQueryBuilder>;
  getManyAndCount: jest.Mock<Promise<[Order[], number]>>;
};


describe('OrdersService', () => {
  let service: OrdersService;
  let orderRepository: MockRepository<Order>;
  let productRepository: MockRepository<Product>;
  let dataSource: MockDataSource;
  let queryRunner: MockQueryRunner;
  let mockQueryBuilder: MockOrderQueryBuilder;

  beforeEach(async () => {
    // Создаем мок QueryRunner
    queryRunner = {
      connect: jest.fn().mockResolvedValue(undefined),
      startTransaction: jest.fn().mockResolvedValue(undefined),
      commitTransaction: jest.fn().mockResolvedValue(undefined),
      rollbackTransaction: jest.fn().mockResolvedValue(undefined),
      release: jest.fn().mockResolvedValue(undefined),
      manager: { // Мокируем методы менеджера транзакций
        findOne: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
      },
    };
    // Создаем мок DataSource
    dataSource = {
      createQueryRunner: jest.fn().mockReturnValue(queryRunner),
    };
     // Создаем мок QueryBuilder для findAll
     mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getRepositoryToken(Order), useValue: createMockRepository() },
        { provide: getRepositoryToken(Product), useValue: createMockRepository() },
        { provide: DataSource, useValue: dataSource }, // Предоставляем мок DataSource
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderRepository = module.get(getRepositoryToken(Order));
    productRepository = module.get(getRepositoryToken(Product));

    // Настраиваем createQueryBuilder ПОСЛЕ получения инстанса репозитория
    orderRepository.createQueryBuilder!.mockReturnValue(mockQueryBuilder as any);
    jest.clearAllMocks(); // Сбрасываем все моки
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Тесты для create ---
  describe('create', () => {
    const createDto: CreateOrderDto = { shippingAddress: '123 Test St', items: [{ productId: 1, quantity: 2 }] };
    const user = { id: 1, email: 'test@test.com', role: Role.User } as User;
    const product = { id: 1, name: 'Test Prod', price: 10, stock: 5 } as Product;
    const orderItemData = { product: product, quantity: 2, price: 10 };
    const orderData = { user: user, items: [orderItemData], totalAmount: 20, shippingAddress: createDto.shippingAddress, status: OrderStatus.PENDING };
    const savedOrder = { ...orderData, id: 1, createdAt: new Date() } as Order;

    it('should create an order successfully using transactions', async () => {
      // Arrange
      queryRunner.manager.findOne.mockResolvedValue(product); // Product found
      queryRunner.manager.create // Mock OrderItem creation
        .mockImplementation((entityCtor, data) => (entityCtor === OrderItem ? { ...data } : {}));
      queryRunner.manager.create // Mock Order creation
        .mockImplementation((entityCtor, data) => (entityCtor === Order ? { ...data } : {}));
      queryRunner.manager.save // Mock Product save (stock update)
        .mockImplementation((entityCtor, data) => (entityCtor === Product ? Promise.resolve({ ...data }) : Promise.resolve({})));
      queryRunner.manager.save // Mock Order save
        .mockImplementation((entityCtor, data) => (entityCtor === Order ? Promise.resolve({ ...data, id: 1, createdAt: new Date() }) : Promise.resolve({})));
      // Мокируем findOne, который вызывается в конце create
      jest.spyOn(service, 'findOne').mockResolvedValue(savedOrder);

      // Act
      const result = await service.create(createDto, user);

      // Assert
      expect(result).toEqual(savedOrder);
      expect(dataSource.createQueryRunner).toHaveBeenCalledTimes(1);
      expect(queryRunner.connect).toHaveBeenCalledTimes(1);
      expect(queryRunner.startTransaction).toHaveBeenCalledTimes(1);
      // Проверка операций внутри транзакции
      expect(queryRunner.manager.findOne).toHaveBeenCalledWith(Product, { where: { id: 1 } });
      expect(queryRunner.manager.save).toHaveBeenCalledWith(Product, { ...product, stock: 3 }); // Проверка уменьшения стока
      expect(queryRunner.manager.create).toHaveBeenCalledWith(OrderItem, expect.objectContaining({ quantity: 2, price: 10 }));
      expect(queryRunner.manager.create).toHaveBeenCalledWith(Order, expect.objectContaining({ totalAmount: 20 }));
      expect(queryRunner.manager.save).toHaveBeenCalledWith(Order, expect.any(Object)); // Проверка сохранения заказа
      // Проверка завершения транзакции
      expect(queryRunner.commitTransaction).toHaveBeenCalledTimes(1);
      expect(queryRunner.rollbackTransaction).not.toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalledTimes(1);
       // Проверка финального вызова findOne
      expect(service.findOne).toHaveBeenCalledWith(savedOrder.id, user);
    });

     it('should rollback transaction if product not found', async () => {
       // Arrange
       queryRunner.manager.findOne.mockResolvedValue(null); // Product not found
       jest.spyOn(service, 'findOne'); // Шпионим, чтобы проверить, что он не вызывался

       // Act & Assert
       await expect(service.create(createDto, user)).rejects.toThrow(NotFoundException);
       expect(queryRunner.startTransaction).toHaveBeenCalledTimes(1);
       expect(queryRunner.manager.findOne).toHaveBeenCalledWith(Product, { where: { id: 1 } });
       expect(queryRunner.manager.save).not.toHaveBeenCalled(); // Ничего не должно было сохраниться
       expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
       expect(queryRunner.rollbackTransaction).toHaveBeenCalledTimes(1); // Откат!
       expect(queryRunner.release).toHaveBeenCalledTimes(1);
       expect(service.findOne).not.toHaveBeenCalled();
     });

     it('should rollback transaction if stock is insufficient', async () => {
       // Arrange
       const lowStockProduct = { ...product, stock: 1 }; // Only 1 in stock
       queryRunner.manager.findOne.mockResolvedValue(lowStockProduct);
       jest.spyOn(service, 'findOne');

       // Act & Assert
       await expect(service.create(createDto, user)).rejects.toThrow(BadRequestException);
       expect(queryRunner.startTransaction).toHaveBeenCalledTimes(1);
       expect(queryRunner.manager.findOne).toHaveBeenCalledWith(Product, { where: { id: 1 } });
       expect(queryRunner.manager.save).not.toHaveBeenCalled();
       expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
       expect(queryRunner.rollbackTransaction).toHaveBeenCalledTimes(1); // Откат!
       expect(queryRunner.release).toHaveBeenCalledTimes(1);
       expect(service.findOne).not.toHaveBeenCalled();
     });
  });

  // --- Тесты для findAll (с QueryBuilder) ---
  describe('findAll', () => {
    const user = { id: 1, email: 'user@test.com', role: Role.User, password:'hash' } as User; // Добавим пароль в мок
    const admin = { id: 2, email: 'admin@test.com', role: Role.Admin, password:'hash' } as User;
    const queryDto = new FindOrdersDto();
    // Моки заказов С паролем пользователя
    const ordersWithPassword = [
      { id: 1, user: user, items: [], status: OrderStatus.PENDING, totalAmount: 10, createdAt: new Date(), shippingAddress: '' },
      { id: 2, user: user, items: [], status: OrderStatus.PENDING, totalAmount: 20, createdAt: new Date(), shippingAddress: '' }
    ] as Order[];
    // Ожидаемый результат БЕЗ пароля пользователя
    const expectedOrdersWithoutPassword = ordersWithPassword.map(o => ({...o, user: {id: o.user.id, email: o.user.email, role: o.user.role}}));

    it('should return orders for the current user and remove password', async () => {
        // Arrange
        mockQueryBuilder.getManyAndCount.mockResolvedValue([ordersWithPassword, ordersWithPassword.length]);

        // Act
        const result = await service.findAll(queryDto, user); // Передаем user

        // Assert
        expect(result.data).toEqual(expectedOrdersWithoutPassword); // Проверяем результат без пароля
        expect(result.count).toEqual(ordersWithPassword.length);
        expect(orderRepository.createQueryBuilder).toHaveBeenCalledWith('order');
        expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('order.userId = :currentUserId', { currentUserId: user.id });
        expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
    });

    it('should return all orders for admin and remove passwords', async () => {
         // Arrange
         const allOrdersWithPassword = [
             ...ordersWithPassword,
             { id: 3, user: admin, items: [], status: OrderStatus.PENDING, totalAmount: 30, createdAt: new Date(), shippingAddress: '' }
           ] as Order[];
        const expectedAllOrdersWithoutPassword = allOrdersWithPassword.map(o => ({...o, user: {id: o.user.id, email: o.user.email, role: o.user.role}}));
         mockQueryBuilder.getManyAndCount.mockResolvedValue([allOrdersWithPassword, allOrdersWithPassword.length]);

         // Act
         const result = await service.findAll(queryDto, admin); // Admin вызывает БЕЗ user ID в DTO

         // Assert
         expect(result.data).toEqual(expectedAllOrdersWithoutPassword);
         expect(result.count).toEqual(allOrdersWithPassword.length);
         expect(orderRepository.createQueryBuilder).toHaveBeenCalledWith('order');
         // ✅ Проверяем, что НЕ БЫЛО фильтрации по userId
         expect(mockQueryBuilder.andWhere).not.toHaveBeenCalledWith(expect.stringContaining('userId'), expect.any(Object));
         expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
    });

    // ... тесты для фильтрации по status и userId для админа ...
  });

  // --- Тесты для findOne ---
  describe('findAll', () => {
    const user = { id: 1, email: 'user@test.com', role: Role.User, password:'hash' } as User; // Добавим пароль в мок
    const admin = { id: 2, email: 'admin@test.com', role: Role.Admin, password:'hash' } as User;
    const queryDto = new FindOrdersDto();
    // Моки заказов С паролем пользователя
    const ordersWithPassword = [
      { id: 1, user: user, items: [], status: OrderStatus.PENDING, totalAmount: 10, createdAt: new Date(), shippingAddress: '' },
      { id: 2, user: user, items: [], status: OrderStatus.PENDING, totalAmount: 20, createdAt: new Date(), shippingAddress: '' }
    ] as Order[];
    // Ожидаемый результат БЕЗ пароля пользователя
    const expectedOrdersWithoutPassword = ordersWithPassword.map(o => ({...o, user: {id: o.user.id, email: o.user.email, role: o.user.role}}));

    it('should return orders for the current user and remove password', async () => {
        // Arrange
        mockQueryBuilder.getManyAndCount.mockResolvedValue([ordersWithPassword, ordersWithPassword.length]);

        // Act
        const result = await service.findAll(queryDto, user); // Передаем user

        // Assert
        expect(result.data).toEqual(expectedOrdersWithoutPassword); // Проверяем результат без пароля
        expect(result.count).toEqual(ordersWithPassword.length);
        expect(orderRepository.createQueryBuilder).toHaveBeenCalledWith('order');
        expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('order.userId = :currentUserId', { currentUserId: user.id });
        expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
    });

    it('should return all orders for admin and remove passwords', async () => {
         // Arrange
         const allOrdersWithPassword = [
             ...ordersWithPassword,
             { id: 3, user: admin, items: [], status: OrderStatus.PENDING, totalAmount: 30, createdAt: new Date(), shippingAddress: '' }
           ] as Order[];
        const expectedAllOrdersWithoutPassword = allOrdersWithPassword.map(o => ({...o, user: {id: o.user.id, email: o.user.email, role: o.user.role}}));
         mockQueryBuilder.getManyAndCount.mockResolvedValue([allOrdersWithPassword, allOrdersWithPassword.length]);

         // Act
         const result = await service.findAll(queryDto, admin); // Admin вызывает БЕЗ user ID в DTO

         // Assert
         expect(result.data).toEqual(expectedAllOrdersWithoutPassword);
         expect(result.count).toEqual(allOrdersWithPassword.length);
         expect(orderRepository.createQueryBuilder).toHaveBeenCalledWith('order');
         // ✅ Проверяем, что НЕ БЫЛО фильтрации по userId
         expect(mockQueryBuilder.andWhere).not.toHaveBeenCalledWith(expect.stringContaining('userId'), expect.any(Object));
         expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
    });

    // ... тесты для фильтрации по status и userId для админа ...
  });

  // --- Тесты для updateStatus ---
  describe('updateStatus', () => {
     const orderId = 1;
     const updateDto: UpdateOrderStatusDto = { status: OrderStatus.SHIPPED };
     const order = { id: orderId, status: OrderStatus.PENDING, user: { id: 1, email:'test@test.com', password: 'hash' } } as Order;
     const updatedOrderData = { ...order, status: OrderStatus.SHIPPED };
     // Ожидаемый результат без пароля
     const expectedUpdatedOrder = { id: orderId, status: OrderStatus.SHIPPED, user: { id: 1, email:'test@test.com' } };


     it('should update order status successfully and return order without password', async () => {
         // Arrange
         orderRepository.findOne!.mockResolvedValue(order);
         orderRepository.save!.mockResolvedValue(updatedOrderData);

         // Act
         const result = await service.updateStatus(orderId, updateDto);

         // Assert
         expect(result).toEqual(expectedUpdatedOrder);
         expect(orderRepository.findOne).toHaveBeenCalledWith({ where: { id: orderId }, relations: ['user'] });
         expect(orderRepository.save).toHaveBeenCalledWith(expect.objectContaining({ status: OrderStatus.SHIPPED }));
     });

      it('should throw NotFoundException if order not found', async () => {
         // Arrange
         orderRepository.findOne!.mockResolvedValue(null);

         // Act & Assert
         await expect(service.updateStatus(orderId, updateDto)).rejects.toThrow(NotFoundException);
         expect(orderRepository.save).not.toHaveBeenCalled();
     });
  });

}); // Конец describe('OrdersService')