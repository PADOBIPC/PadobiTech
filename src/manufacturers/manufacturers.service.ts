import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
import { Manufacturer } from './entities/manufacturer.entity';

@Injectable()
export class ManufacturersService {
  constructor(
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,
  ) {}

  create(createManufacturerDto: CreateManufacturerDto): Promise<Manufacturer> {
    const manufacturer = this.manufacturerRepository.create(createManufacturerDto);
    return this.manufacturerRepository.save(manufacturer);
  }

  findAll(): Promise<Manufacturer[]> {
    return this.manufacturerRepository.find({ relations: ['categories', 'products'] });
  }

  async findOne(id: number): Promise<Manufacturer> {
    const manufacturer = await this.manufacturerRepository.findOne({
      where: { id },
      relations: ['categories', 'products'],
    });
    if (!manufacturer) {
      throw new NotFoundException(`Manufacturer with ID ${id} not found`);
    }
    return manufacturer;
  }

  async update(id: number, updateManufacturerDto: UpdateManufacturerDto): Promise<Manufacturer> {
    const manufacturer = await this.manufacturerRepository.preload({
      id,
      ...updateManufacturerDto,
    });
    if (!manufacturer) {
      throw new NotFoundException(`Manufacturer with ID ${id} not found`);
    }
    return this.manufacturerRepository.save(manufacturer);
  }

  async remove(id: number): Promise<void> {
    const manufacturer = await this.findOne(id);
    await this.manufacturerRepository.remove(manufacturer);
  }
}