import { Vehicle } from '../vehicles/entities/vehicle.entity';
export declare class Customer {
    id: number;
    fullName: string;
    primaryPhone: string;
    alternatePhones?: string[];
    address?: string;
    vehicles: Vehicle[];
    createdAt: Date;
}
