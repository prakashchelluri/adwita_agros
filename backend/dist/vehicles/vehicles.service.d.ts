import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Customer } from '../customers/customer.entity';
import { CreateVehicleWithCustomerDto } from './dto/create-vehicle-with-customer.dto';
export declare class VehiclesService {
    private readonly vehicleRepository;
    private readonly customerRepository;
    constructor(vehicleRepository: Repository<Vehicle>, customerRepository: Repository<Customer>);
    create(createVehicleDto: CreateVehicleDto): Promise<Vehicle>;
    createWithCustomer(createVehicleWithCustomerDto: CreateVehicleWithCustomerDto): Promise<Vehicle>;
    findAll(): Promise<Vehicle[]>;
    findOne(id: number): Promise<Vehicle>;
    findOneByChassisNumber(chassisNumber: string): Promise<Vehicle>;
    findByCustomerId(customerId: number): Promise<Vehicle[]>;
    update(id: number, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle>;
    remove(id: number): Promise<void>;
    checkWarrantyStatus(id: number): Promise<{
        isUnderWarranty: boolean;
        warrantyEndDate: Date;
        daysRemaining: number;
    }>;
}
