import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
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
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const { items, shippingAddress } = createOrderDto;

    // Начинаем транзакцию
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
        await queryRunner.manager.save(Product, product);

        // 3. Создаем OrderItem
        const orderItem = queryRunner.manager.create(OrderItem, {
          product: product,
          quantity: itemDto.quantity,
          price: product.price,
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

      // Сохраняем Order
      const savedOrder = await queryRunner.manager.save(Order, order);

      await queryRunner.commitTransaction();

       return await this.findOne(savedOrder.id, user);
    } catch (error) {
      // Если произошла ошибка - отменяем все изменения
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Метод для получения одного заказа
  async findOne(id: number, user: User): Promise<Order> {
     const order = await this.orderRepository.findOne({
       where: { id, user: { id: user.id } },
       relations: ['items', 'items.product'],
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
      order: { createdAt: 'DESC' },
    });
  }
}