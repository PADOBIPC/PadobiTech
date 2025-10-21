import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { FindProductsDto } from './dto/find-products.dto';
import { Manufacturer } from '../manufacturers/entities/manufacturer.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { manufacturerId, categoryId, ...productData } = createProductDto;

    const manufacturer = { id: manufacturerId } as Manufacturer;
    const category = { id: categoryId } as Category;

    const product = this.productRepository.create({
      ...productData,
      manufacturer,
      category,
    });

    return this.productRepository.save(product);
  }

  async findAll(query: FindProductsDto): Promise<{ data: Product[], count: number }> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'id',
      order = 'ASC',
      manufacturerId,
      categoryId,
      search,
      minPrice,
      maxPrice,
    } = query;

    const qb = this.productRepository.createQueryBuilder('product');

    qb.leftJoinAndSelect('product.manufacturer', 'manufacturer');
    qb.leftJoinAndSelect('product.category', 'category');

    // --- ФИЛЬТРАЦИЯ ---
    if (manufacturerId) {
      qb.andWhere('product.manufacturerId = :manufacturerId', { manufacturerId });
    }
    if (categoryId) {
      qb.andWhere('product.categoryId = :categoryId', { categoryId });
    }
    if (minPrice) {
      qb.andWhere('product.price >= :minPrice', { minPrice });
    }
    if (maxPrice) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice });
    }
    if (search) {
      qb.andWhere('(product.name LIKE :search OR product.description LIKE :search)', {
        search: `%${search}%`,
      });
    }

    // --- СОРТИРОВКА ---
    const validSortColumns = {
      id: 'product.id',
      name: 'product.name',
      price: 'product.price',
      stock: 'product.stock',
      manufacturerName: 'manufacturer.name',
      categoryName: 'category.name',
    };
    const orderBy = validSortColumns[sortBy] || 'product.id';
    qb.orderBy(orderBy, order);

    // --- ПАГИНАЦИЯ ---
    qb.skip((page - 1) * limit);
    qb.take(limit);

    const [data, count] = await qb.getManyAndCount();
        
    return { data, count };
  }


  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['manufacturer', 'category'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}