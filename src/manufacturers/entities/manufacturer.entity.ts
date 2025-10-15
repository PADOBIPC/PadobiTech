import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('manufacturers')
export class Manufacturer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  country: string;

  @Column()
  foundedYear: number;

  @OneToMany(() => Category, (category) => category.manufacturer)
  categories: Category[];

  @OneToMany(() => Product, (product) => product.manufacturer)
  products: Product[];
}