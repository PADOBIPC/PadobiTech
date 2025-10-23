import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    // ✅ НАСТРОЙКА MULTER
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          destination: './uploads/products', // Папка для сохранения
          filename: (req, file, callback) => {
            // Генерируем уникальное имя файла
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const extension = extname(file.originalname); // Берем расширение файла
            const filename = `${file.fieldname}-${uniqueSuffix}${extension}`;
            callback(null, filename);
          },
        }),
        fileFilter: (req, file, callback) => {
            // Проверяем тип файла (только картинки)
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return callback(new Error('Only image files are allowed!'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 1024 * 1024 * 5 // Ограничение 5MB
        }
      }),
    }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}