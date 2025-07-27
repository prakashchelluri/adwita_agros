import { Customer } from '../customers/customer.entity';
export declare class Vehicle {
    id: number;
    customer: Customer;
    chassisNumber: string;
    modelName: string;
    purchaseDate: Date;
    createdAt: Date;
}
