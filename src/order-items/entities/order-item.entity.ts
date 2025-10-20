import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  // Связь с заказом
  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  // Связь с продуктом
  @ManyToOne(() => Product, { eager: true }) // eager: true - чтобы продукт подгружался автоматически
  product: Product;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number; // Цена товара на момент заказа
}