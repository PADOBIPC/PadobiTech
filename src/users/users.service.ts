import { ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    
    const savedUser = await this.userRepository.save(user);

    const { password: _, ...result } = savedUser;
    return result;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepository.findOneBy({ email });
    return user ?? undefined;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }
    const { password: _, ...result } = user;
    return result;
  }
}