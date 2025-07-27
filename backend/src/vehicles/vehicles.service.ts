
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Customer } from '../customers/customer.entity';
import { CreateVehicleWithCustomerDto } from './dto/create-vehicle-with-customer.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto): Promise<Vehicle> {
    // Check if chassis number already exists
    const existingVehicle = await this.vehicleRepository.findOneBy({
      chassisNumber: createVehicleDto.chassisNumber,
    });
    if (existingVehicle) {
      throw new ConflictException('Vehicle with this chassis number already exists');
    }

    // Check if customer exists
    const customer = await this.customerRepository.findOneBy({
      id: createVehicleDto.customerId,
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const vehicle = this.vehicleRepository.create({
      ...createVehicleDto,
      purchaseDate: new Date(createVehicleDto.purchaseDate),
      customer,
    });

    return this.vehicleRepository.save(vehicle);
  }

  async createWithCustomer(createVehicleWithCustomerDto: CreateVehicleWithCustomerDto): Promise<Vehicle> {
    // Check if chassis number already exists
    const existingVehicle = await this.vehicleRepository.findOneBy({
      chassisNumber: createVehicleWithCustomerDto.chassisNumber,
    });
    if (existingVehicle) {
      throw new ConflictException('Vehicle with this chassis number already exists');
    }

    // Check if customer exists by primaryPhone
    let customer = await this.customerRepository.findOneBy({
      primaryPhone: createVehicleWithCustomerDto.primaryPhone,
    });

    // If customer does not exist, create new
    if (!customer) {
      customer = this.customerRepository.create({
        fullName: createVehicleWithCustomerDto.fullName,
        primaryPhone: createVehicleWithCustomerDto.primaryPhone,
      });
      await this.customerRepository.save(customer);
    }

    const vehicle = this.vehicleRepository.create({
      chassisNumber: createVehicleWithCustomerDto.chassisNumber,
      purchaseDate: new Date(createVehicleWithCustomerDto.purchaseDate),
      invoiceNumber: createVehicleWithCustomerDto.invoiceNumber,
      customer,
    });

    return this.vehicleRepository.save(vehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepository.find({
      relations: ['customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['customer', 'serviceRequests'],
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    return vehicle;
  }

  async findOneByChassisNumber(chassisNumber: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { chassisNumber },
      relations: ['customer'],
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with chassis number ${chassisNumber} not found`);
    }
    return vehicle;
  }

  async findByCustomerId(customerId: number): Promise<Vehicle[]> {
    return this.vehicleRepository.find({
      where: { customer: { id: customerId } },
      relations: ['customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.findOne(id);

    // If chassis number is being updated, check for conflicts
    if (updateVehicleDto.chassisNumber && updateVehicleDto.chassisNumber !== vehicle.chassisNumber) {
      const existingVehicle = await this.vehicleRepository.findOneBy({
        chassisNumber: updateVehicleDto.chassisNumber,
      });
      if (existingVehicle) {
        throw new ConflictException('Vehicle with this chassis number already exists');
      }
    }

    // If customer is being updated, check if customer exists
    if (updateVehicleDto.customerId) {
      const customer = await this.customerRepository.findOneBy({
        id: updateVehicleDto.customerId,
      });
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }
      vehicle.customer = customer;
    }

    // Update other fields
    Object.assign(vehicle, {
      ...updateVehicleDto,
      purchaseDate: updateVehicleDto.purchaseDate
        ? new Date(updateVehicleDto.purchaseDate)
        : vehicle.purchaseDate,
    });

    return this.vehicleRepository.save(vehicle);
  }

  async remove(id: number): Promise<void> {
    const vehicle = await this.findOne(id);
    await this.vehicleRepository.remove(vehicle);
  }

  async checkWarrantyStatus(id: number): Promise<{
    isUnderWarranty: boolean;
    warrantyEndDate: Date;
    daysRemaining: number;
  }> {
    const vehicle = await this.findOne(id);
    
    const warrantyEndDate = new Date(vehicle.purchaseDate);
    warrantyEndDate.setMonth(warrantyEndDate.getMonth() + vehicle.warrantyPeriodMonths);
    
    const today = new Date();
    const isUnderWarranty = vehicle.isWarrantyActive && today <= warrantyEndDate;
    const daysRemaining = Math.max(0, Math.ceil((warrantyEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

    return {
      isUnderWarranty,
      warrantyEndDate,
      daysRemaining,
    };
  }
}
