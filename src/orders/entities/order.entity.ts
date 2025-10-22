import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from '../../order-items/entities/order-item.entity';

export enum OrderStatus {
  PENDING = 'pending',          // Ожидает подтверждения/оплаты
  PROCESSING = 'processing',    // В обработке (оплата получена, комплектуется)
  SHIPPED = 'shipped',          // Отправлен
  DELIVERED = 'delivered',      // Доставлен
  COMPLETED = 'completed',      // Завершен (после доставки, опционально)
  CANCELLED = 'cancelled',      // Отменен (пользователем или админом)
  REFUNDED = 'refunded',        // Возвращен (полностью или частично)
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  shippingAddress: string;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];
}