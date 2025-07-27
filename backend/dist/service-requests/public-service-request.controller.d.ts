import { ServiceRequestsService } from './service-requests.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { VehiclesService } from '../vehicles/vehicles.service';
import { CustomersService } from '../customers/customers.service';
export declare class PublicServiceRequestController {
    private readonly serviceRequestsService;
    private readonly vehiclesService;
    private readonly customersService;
    constructor(serviceRequestsService: ServiceRequestsService, vehiclesService: VehiclesService, customersService: CustomersService);
    createPublicRequest(createDto: CreateServiceRequestDto, files?: any[]): Promise<{
        success: boolean;
        ticketNumber: string;
        message: string;
        warrantyStatus: string;
    }>;
    checkVehicle(chassisNumber: string): Promise<{
        found: boolean;
        vehicle: {
            chassisNumber: string;
            modelName: string;
            purchaseDate: Date;
        };
        customer: {
            name: string;
            phone: string;
        };
        warranty: {
            isUnderWarranty: boolean;
            warrantyEndDate: Date;
            daysRemaining: number;
        };
        message?: undefined;
    } | {
        found: boolean;
        message: string;
        vehicle?: undefined;
        customer?: undefined;
        warranty?: undefined;
    }>;
    getRequestStatus(ticketNumber: string): Promise<{
        found: boolean;
        ticketNumber: string;
        status: import("./service-request.entity").RequestStatus;
        type: import("./service-request.entity").RequestType;
        createdAt: Date;
        assignedTechnician: any;
        manufacturerApprovalStatus: import("./service-request.entity").RequestStatus;
        isWarrantyEligible: boolean;
        message?: undefined;
    } | {
        found: boolean;
        message: string;
        ticketNumber?: undefined;
        status?: undefined;
        type?: undefined;
        createdAt?: undefined;
        assignedTechnician?: undefined;
        manufacturerApprovalStatus?: undefined;
        isWarrantyEligible?: undefined;
    }>;
    getAllPublicRequests(): Promise<{
        success: boolean;
        data: import("./service-request.entity").ServiceRequest[];
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        data?: undefined;
    }>;
}
