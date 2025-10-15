import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('manufacturers') // Указываем имя таблицы в БД
export class Manufacturer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // Название производителя должно быть уникальным
  name: string;

  @Column()
  country: string;

  @Column()
  foundedYear: number;

  // Описываем связь: у одного производителя может быть много категорий
  @OneToMany(() => Category, (category) => category.manufacturer)
  categories: Category[];

  // Описываем связь: у одного производителя может быть много продуктов
  @OneToMany(() => Product, (product) => product.manufacturer)
  products: Product[];
}