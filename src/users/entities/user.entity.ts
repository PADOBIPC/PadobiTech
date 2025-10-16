import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users') // Указываем имя таблицы в БД
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true }) // email должен быть уникальным
  email: string;

  @Column()
  password: string; // Мы будем хранить здесь хэшированный пароль, а не сам пароль
}