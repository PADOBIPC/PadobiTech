import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Manufacturer } from '../manufacturers/entities/manufacturer.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { manufacturerId, ...categoryData } = createCategoryDto;
    
    const manufacturer = { id: manufacturerId } as Manufacturer;

    const category = this.categoryRepository.create({
      ...categoryData,
      manufacturer,
    });
    
    return this.categoryRepository.save(category);
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: ['manufacturer', 'products'] });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['manufacturer', 'products'],
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  // ✅ РЕФАКТОРИНГ МЕТОДА update
  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const { manufacturerId, ...categoryData } = updateCategoryDto;
    
    // 1. Находим категорию напрямую через репозиторий
    const category = await this.categoryRepository.findOne({ 
        where: { id },
        // Можно убрать relations, если они не нужны для логики обновления
    }); 

    // 2. Если не найдена - выбрасываем ошибку
    if (!category) {
      throw new NotFoundException(`Категория с ID ${id} не найдена.`);
    }

    // 3. Сливаем простые данные из DTO
    this.categoryRepository.merge(category, categoryData);

    // 4. Обновляем связь, если manufacturerId передан
    if (manufacturerId) {
      // Убедись, что PrimaryKey в Manufacturer называется 'id'
      category.manufacturer = { id: manufacturerId } as Manufacturer; 
    }
    
    // 5. Сохраняем обновленную сущность
    return this.categoryRepository.save(category);
  }
  

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}