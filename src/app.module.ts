import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    TypeOrmModule.forRoot(databaseConfig), ManufacturersModule, CategoriesModule, ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}