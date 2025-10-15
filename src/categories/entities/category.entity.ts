import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Manufacturer } from '../../manufacturers/entities/manufacturer.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column('text') // 'text' подходит для длинных описаний
  description: string;
  
  // Описываем связь: много категорий могут принадлежать одному производителю
  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.categories)
  @JoinColumn({ name: 'manufacturerId' }) // Явно указываем имя колонки для связи
  manufacturer: Manufacturer;

  // Описываем связь: в одной категории может быть много продуктов
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}