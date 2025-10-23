import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ManufacturersModule } from './catalog/manufacturers/manufacturers.module';
import { CategoriesModule } from './catalog/categories/categories.module';
import { ProductsModule } from './catalog/products/products.module';
import { UsersModule } from './core/users/users.module';
import { AuthModule } from './core/auth/auth.module';
import { OrdersModule } from './orders/orders/orders.module';
import { OrderItemsModule } from './orders/order-items/order-items.module';
import { ReviewsModule } from './catalog/reviews/reviews.module';
import { databaseConfig } from './core/config/database.config';
import { JwtStrategy } from './shared/strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRoot(databaseConfig), ManufacturersModule, CategoriesModule, ProductsModule, UsersModule, AuthModule, OrdersModule, OrderItemsModule, ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}