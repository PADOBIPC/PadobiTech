import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from '../../order-items/entities/order-item.entity';

// Добавим статусы заказа
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  // Связь с пользователем
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  // Статус заказа
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  // Общая сумма заказа
  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @CreateDateColumn() // Автоматически добавляет дату создания
  createdAt: Date;

  // Адрес доставки (пока просто строка)
  @Column()
  shippingAddress: string;

  // Связь с позициями заказа
  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true }) // cascade: true - чтобы OrderItems создавались вместе с Order
  items: OrderItem[];
}