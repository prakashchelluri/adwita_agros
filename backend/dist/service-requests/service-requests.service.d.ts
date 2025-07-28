import { Repository } from 'typeorm';
import { ServiceRequest } from './service-request.entity';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { QueryServiceRequestDto } from './dto/query-service-request.dto';
export declare class ServiceRequestsService {
    private serviceRequestRepository;
    constructor(serviceRequestRepository: Repository<ServiceRequest>);
    create(createServiceRequestDto: CreateServiceRequestDto): Promise<ServiceRequest>;
    private generateTicketNumber;
    findAll(query: QueryServiceRequestDto): Promise<ServiceRequest[]>;
    findPublicRequests(query: QueryServiceRequestDto): Promise<ServiceRequest[]>;
    findByTicketNumber(ticketNumber: string): Promise<ServiceRequest>;
    findAllPublic(): Promise<ServiceRequest[]>;
    findOne(id: number): Promise<ServiceRequest>;
    update(id: number, updateServiceRequestDto: UpdateServiceRequestDto): Promise<ServiceRequest>;
    remove(id: number): Promise<void>;
    updateApprovalStatus(id: number, request: ServiceRequest): Promise<import("typeorm").UpdateResult>;
}
