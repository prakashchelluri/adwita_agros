import { Customer } from '../../customers/customer.entity';
import { ServiceRequest } from '../../service-requests/service-request.entity';
export declare class Vehicle {
    id: number;
    chassisNumber: string;
    engineNumber: string;
    modelName: string;
    purchaseDate: Date;
    warrantyPeriodMonths: number;
    isWarrantyActive: boolean;
    customer: Customer;
    serviceRequests: ServiceRequest[];
    createdAt: Date;
    updatedAt: Date;
    isUnderWarranty(): boolean;
}
