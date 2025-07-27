import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
export declare class CustomersService {
    private readonly customerRepository;
    constructor(customerRepository: Repository<Customer>);
    create(createCustomerDto: CreateCustomerDto): Promise<Customer>;
    findByPhone(phoneNumber: string): Promise<Customer>;
    findOrCreate(fullName: string, primaryPhone: string): Promise<Customer>;
    findAll(): Promise<Customer[]>;
    findOne(id: number): Promise<Customer>;
}
