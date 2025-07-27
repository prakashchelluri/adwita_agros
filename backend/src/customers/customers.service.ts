import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(customer);
  }

  async findByPhone(phoneNumber: string): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({
      primaryPhone: phoneNumber
    });
    
    if (!customer) {
      throw new NotFoundException(`Customer with phone ${phoneNumber} not found`);
    }
    
    return customer;
  }

  async findOrCreate(fullName: string, primaryPhone: string): Promise<Customer> {
    let customer = await this.customerRepository.findOneBy({ primaryPhone });
    if (!customer) {
      customer = this.customerRepository.create({
        fullName,
        primaryPhone,
      });
      await this.customerRepository.save(customer);
    }
    return customer;
  }

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find({
      relations: ['vehicles'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['vehicles'],
    });
    
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    
    return customer;
  }
}