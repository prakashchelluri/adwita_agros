import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryPart } from './inventory-part.entity';
import { CreateInventoryPartDto } from './create-inventory-part.dto';
import { UpdateInventoryPartDto } from './update-inventory-part.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryPart)
    private readonly inventoryRepository: Repository<InventoryPart>,
  ) {}

  create(createDto: CreateInventoryPartDto): Promise<InventoryPart> {
    const part = this.inventoryRepository.create(createDto);
    return this.inventoryRepository.save(part);
  }

  findAll(): Promise<InventoryPart[]> {
    return this.inventoryRepository.find();
  }

  async findOne(id: number): Promise<InventoryPart> {
    const part = await this.inventoryRepository.findOneBy({ id });
    if (!part) {
      throw new NotFoundException(`Inventory part with ID "${id}" not found`);
    }
    return part;
  }

  async update(
    id: number,
    updateDto: UpdateInventoryPartDto,
  ): Promise<InventoryPart> {
    const part = await this.inventoryRepository.preload({ id, ...updateDto });
    if (!part) {
      throw new NotFoundException(`Inventory part with ID "${id}" not found`);
    }
    return this.inventoryRepository.save(part);
  }
}