import { ServiceRequestsService } from './service-requests.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { QueryServiceRequestDto } from './dto/query-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { UpdateApprovalStatusDto } from './dto/update-approval-status.dto';
import { AddPartToRequestDto } from './dto/add-part-to-request.dto';
export declare class ServiceRequestsController {
    private readonly serviceRequestsService;
    constructor(serviceRequestsService: ServiceRequestsService);
    create(createServiceRequestDto: CreateServiceRequestDto): Promise<import("./service-request.entity").ServiceRequest>;
    findAll(query: QueryServiceRequestDto, user: any): Promise<import("./service-request.entity").ServiceRequest[]>;
    findOne(id: number): Promise<import("./service-request.entity").ServiceRequest>;
    update(id: number, updateDto: UpdateServiceRequestDto): Promise<import("./service-request.entity").ServiceRequest>;
    addPart(id: number, addPartDto: AddPartToRequestDto): Promise<import("./service-request-part-used.entity").ServiceRequestPartUsed>;
    updateApproval(id: number, approvalDto: UpdateApprovalStatusDto): Promise<import("./service-request.entity").ServiceRequest>;
}
