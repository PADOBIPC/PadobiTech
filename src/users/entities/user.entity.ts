// src/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Role } from '../../auth/roles.enum'; // <-- 1. Импортируйте Role
import { Order } from '../../orders/entities/order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  // ✅ 2. ДОБАВЬТЕ ЭТО ПОЛЕ
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User, // По умолчанию все новые пользователи - 'user'
  })
  role: Role;
  
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}