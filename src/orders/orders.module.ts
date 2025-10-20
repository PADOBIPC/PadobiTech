import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from '../order-items/entities/order-item.entity'; // Импорт OrderItem
import { Product } from '../products/entities/product.entity';     // Импорт Product
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ProductsModule } from '../products/products.module';     // Импорт ProductsModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product]), // Добавляем репозитории
    ProductsModule, // Чтобы иметь доступ к ProductsService (не напрямую, но нужно для TypeORM)
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}