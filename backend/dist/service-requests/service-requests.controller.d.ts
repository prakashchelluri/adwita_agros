import { ServiceRequestsService } from './service-requests.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { QueryServiceRequestDto } from './dto/query-service-request.dto';
export declare class ServiceRequestsController {
    private readonly serviceRequestsService;
    constructor(serviceRequestsService: ServiceRequestsService);
    create(createServiceRequestDto: CreateServiceRequestDto): Promise<import("./service-request.entity").ServiceRequest>;
    findAll(query: QueryServiceRequestDto): Promise<import("./service-request.entity").ServiceRequest[]>;
    findPublicRequests(query: QueryServiceRequestDto): Promise<import("./service-request.entity").ServiceRequest[]>;
    findOne(id: string): Promise<import("./service-request.entity").ServiceRequest>;
    update(id: string, updateServiceRequestDto: UpdateServiceRequestDto): Promise<import("./service-request.entity").ServiceRequest>;
    remove(id: string): Promise<void>;
    sendForApproval(id: string): Promise<{
        message: string;
    }>;
}
