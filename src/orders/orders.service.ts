// src/orders/orders.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm'; // <-- Импортируйте DataSource
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product) // Инжектируем репозиторий Product
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource, // Инжектируем DataSource для транзакций
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const { items, shippingAddress } = createOrderDto;

    // Используем транзакцию, чтобы все операции выполнились успешно, либо ни одна
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      // 1. Проверяем каждый товар в заказе
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

        // 2. Уменьшаем остаток товара
        product.stock -= itemDto.quantity;
        await queryRunner.manager.save(Product, product); // Сохраняем измененный продукт ВНУТРИ транзакции

        // 3. Создаем OrderItem
        const orderItem = queryRunner.manager.create(OrderItem, {
          product: product,
          quantity: itemDto.quantity,
          price: product.price, // Фиксируем цену на момент заказа
        });
        orderItems.push(orderItem);

        // 4. Считаем общую сумму
        totalAmount += product.price * itemDto.quantity;
      }

      // 5. Создаем сам заказ
      const order = queryRunner.manager.create(Order, {
        user: user,
        items: orderItems, // Связываем OrderItems с заказом
        totalAmount: totalAmount,
        shippingAddress: shippingAddress,
        status: OrderStatus.PENDING, // Начальный статус
      });

      // Сохраняем Order (OrderItem сохранятся автоматически благодаря cascade: true)
      const savedOrder = await queryRunner.manager.save(Order, order);

      // Если все прошло успешно - подтверждаем транзакцию
      await queryRunner.commitTransaction();

      // Возвращаем сохраненный заказ (без user.password)
      // Важно! После commitTransaction связи могут не подгрузиться автоматом,
      // поэтому лучше перезапросить заказ уже вне транзакции, если нужны полные данные
       return await this.findOne(savedOrder.id, user); // Перезапрашиваем с нужными связями

    } catch (error) {
      // Если произошла ошибка - отменяем все изменения
      await queryRunner.rollbackTransaction();
      throw error; // Передаем ошибку дальше
    } finally {
      // Всегда освобождаем queryRunner
      await queryRunner.release();
    }
  }

  // Добавим метод findOne для перезапроса заказа
  async findOne(id: number, user: User): Promise<Order> {
     const order = await this.orderRepository.findOne({
       where: { id, user: { id: user.id } }, // Убеждаемся, что заказ принадлежит пользователю
       relations: ['items', 'items.product'], // Подгружаем связанные данные
     });
     if (!order) {
       throw new NotFoundException(`Заказ с ID ${id} не найден.`);
     }
     return order;
  }

   // Метод для получения всех заказов пользователя
  async findAll(user: User): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: user.id } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' }, // Сортируем по дате создания
    });
  }
}