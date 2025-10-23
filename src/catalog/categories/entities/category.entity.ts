import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Manufacturer } from '../../manufacturers/entities/manufacturer.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column('text')
  description: string;
  
  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.categories)
  @JoinColumn({ name: 'manufacturerId' })
  manufacturer: Manufacturer;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}