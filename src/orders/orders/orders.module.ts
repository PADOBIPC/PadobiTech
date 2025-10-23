import { ProductsModule } from './../../catalog/products/products.module';
import { Product } from './../../catalog/products/entities/product.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from '../order-items/entities/order-item.entity';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product]),
    ProductsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}