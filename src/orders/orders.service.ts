import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'; // Убедись, что этот импорт есть
import { FindOrdersDto } from './dto/find-orders.dto';       // Импорт DTO для пагинации
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { Role } from '../auth/roles.enum'; // Импорт Role

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const { items, shippingAddress } = createOrderDto;
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      for (const itemDto of items) {
        const product = await queryRunner.manager.findOne(Product, { 
          where: { id: itemDto.productId } 
        });

        if (!product) {
          throw new NotFoundException(`Продукт с ID ${itemDto.productId} не найден.`);
        }
        if (product.stock < itemDto.quantity) {
          throw new BadRequestException(`Недостаточно товара "${product.name}" на складе (в наличии: ${product.stock}).`);
        }

        product.stock -= itemDto.quantity;
        await queryRunner.manager.save(Product, product);

        const orderItem = queryRunner.manager.create(OrderItem, {
          product: product,
          quantity: itemDto.quantity,
          price: product.price,
        });
        orderItems.push(orderItem);

        totalAmount += product.price * itemDto.quantity;
      }

      const order = queryRunner.manager.create(Order, {
        user: user,
        items: orderItems,
        totalAmount: totalAmount,
        shippingAddress: shippingAddress,
        status: OrderStatus.PENDING,
      });
      
      const savedOrder = await queryRunner.manager.save(Order, order);
      await queryRunner.commitTransaction();
      
      // Перезапрашиваем с нужными связями, чтобы вернуть полный объект
      return await this.findOne(savedOrder.id, user); 
    
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Метод findAll с пагинацией, фильтрацией и сортировкой
  // src/orders/orders.service.ts

  async findAll(
    query: FindOrdersDto, 
    currentUser?: User // Необязательный пользователь для проверки прав
  ): Promise<{ data: Order[], count: number }> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'DESC',
      status,
      userId, // Может прийти от админа из DTO
    } = query;

    const qb = this.orderRepository.createQueryBuilder('order');

    qb.leftJoinAndSelect('order.user', 'user');
    qb.leftJoinAndSelect('order.items', 'orderItem');
    qb.leftJoinAndSelect('orderItem.product', 'product');

    // --- ФИЛЬТРАЦИЯ (Исправленная логика) ---
    if (currentUser) { // Проверка нужна, если вдруг currentUser не передан
        if (currentUser.role !== Role.Admin) {
            // Обычный пользователь ВСЕГДА видит только свои заказы
            qb.andWhere('order.userId = :currentUserId', { currentUserId: currentUser.id });
        } else {
            // Это АДМИН
            if (userId) {
                // Если админ передал userId в query, фильтруем по нему
                qb.andWhere('order.userId = :userId', { userId });
            }
            // Если админ НЕ передал userId, НЕ добавляем фильтр по пользователю (видит все)
        }
    } else {
        // Случай, если currentUser не определен (например, для публичного API, если бы оно было)
        // Здесь можно выбросить ошибку или применить другие правила
        // В нашем случае findAll вызывается из контроллера, где user всегда есть
    }
    
    // Фильтр по статусу (остается без изменений)
    if (status) {
      qb.andWhere('order.status = :status', { status });
    }

    // --- СОРТИРОВКА ---
    const validSortColumns = {
      id: 'order.id',
      createdAt: 'order.createdAt',
      totalAmount: 'order.totalAmount',
      status: 'order.status',
      userEmail: 'user.email', 
    };
    const orderBy = validSortColumns[sortBy] || 'order.createdAt';
    qb.orderBy(orderBy, order);

    // --- ПАГИНАЦИЯ ---
    qb.skip((page - 1) * limit);
    qb.take(limit);

    const [data, count] = await qb.getManyAndCount();

    // Удаляем пароли пользователей перед возвратом
    data.forEach(order => {
        if (order.user) (order.user as any).password = undefined;
    });

    return { data, count };
  }

  // Метод findOne, работающий и для админа, и для пользователя
  async findOne(id: number, user?: User): Promise<Order> { 
     const whereCondition: any = { id };
     // Если user передан и он не админ, ищем только его заказы
     if (user && user.role !== Role.Admin) { 
         whereCondition.user = { id: user.id };
     }
     
     const order = await this.orderRepository.findOne({
       where: whereCondition, 
       relations: ['items', 'items.product', 'user'], 
     });
     if (!order) {
       throw new NotFoundException(`Заказ с ID ${id} не найден.`);
     }
     // Удаляем пароль пользователя перед возвратом
     if (order.user) {
         (order.user as any).password = undefined;
     }
     return order;
  }
  
  // Метод для обновления статуса заказа (для админа)
  async updateStatus(
    orderId: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    // Находим заказ без проверки пользователя
    const order = await this.orderRepository.findOne({ 
        where: { id: orderId },
        relations: ['user'] // Подгружаем пользователя для возврата
     });

    if (!order) {
      throw new NotFoundException(`Заказ с ID ${orderId} не найден.`);
    }

    order.status = updateOrderStatusDto.status;
    const savedOrder = await this.orderRepository.save(order);
    
    if (savedOrder.user) {
         (savedOrder.user as any).password = undefined;
    }
    return savedOrder;
  }
  
  // remove пока не реализуем детально
  // async remove(id: number): Promise<void> { ... }
}