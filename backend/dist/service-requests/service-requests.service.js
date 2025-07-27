"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRequestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const service_request_entity_1 = require("./service-request.entity");
const vehicle_entity_1 = require("../vehicles/entities/vehicle.entity");
const customer_entity_1 = require("../customers/customer.entity");
const user_entity_1 = require("../users/user.entity");
const service_request_part_used_entity_1 = require("./service-request-part-used.entity");
const inventory_part_entity_1 = require("../inventory/inventory-part.entity");
const request_status_enum_1 = require("../common/enums/request-status.enum");
const typeorm_3 = require("typeorm");
let ServiceRequestsService = class ServiceRequestsService {
    constructor(serviceRequestRepository, vehicleRepository, customerRepository, userRepository, partUsedRepository, inventoryRepository) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.vehicleRepository = vehicleRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
        this.partUsedRepository = partUsedRepository;
        this.inventoryRepository = inventoryRepository;
        this.WARRANTY_PERIOD_DAYS = 365;
    }
    async create(createServiceRequestDto) {
        const { chassisNumber, customerName, customerPhone, customerId, vehicleId } = createServiceRequestDto;
        let vehicle;
        let customer;
        if (customerId && vehicleId) {
            customer = await this.customerRepository.findOneBy({ id: customerId });
            vehicle = await this.vehicleRepository.findOneBy({ id: vehicleId });
            if (!customer) {
                throw new common_1.NotFoundException(`Customer with ID ${customerId} not found`);
            }
            if (!vehicle) {
                throw new common_1.NotFoundException(`Vehicle with ID ${vehicleId} not found`);
            }
        }
        else {
            vehicle = await this.vehicleRepository.findOne({
                where: { chassisNumber },
                relations: ['customer'],
            });
            if (!vehicle) {
                throw new common_1.NotFoundException(`Vehicle with chassis number ${chassisNumber} not found`);
            }
            customer = await this.customerRepository.findOne({
                where: { primaryPhone: customerPhone },
            });
            if (!customer) {
                customer = this.customerRepository.create({
                    fullName: customerName,
                    primaryPhone: customerPhone,
                });
                await this.customerRepository.save(customer);
            }
        }
        const isWarrantyEligible = vehicle.isUnderWarranty();
        const ticketNumber = await this._generateTicketNumber();
        const newServiceRequest = this.serviceRequestRepository.create({
            ticketNumber,
            customer,
            vehicle,
            type: createServiceRequestDto.type,
            issueDescription: createServiceRequestDto.issueDescription,
            customerLocation: createServiceRequestDto.customerLocation,
            mediaUrls: createServiceRequestDto.mediaUrls || [],
            status: request_status_enum_1.RequestStatus.NEW,
            isWarrantyEligible,
            manufacturerApprovalStatus: request_status_enum_1.RequestStatus.NEW,
        });
        return this.serviceRequestRepository.save(newServiceRequest);
    }
    async findAll(query = {}) {
        const { status, type, isWarrantyEligible, assignedTechnicianId, customerId, vehicleId, search, page = 1, limit = 20, } = query;
        const options = {
            relations: ['customer', 'vehicle', 'assignedTechnician', 'partsUsed', 'partsUsed.part'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        };
        const where = {};
        if (status)
            where.status = status;
        if (type)
            where.type = type;
        if (isWarrantyEligible !== undefined)
            where.isWarrantyEligible = isWarrantyEligible;
        if (assignedTechnicianId)
            where.assignedTechnician = { id: assignedTechnicianId };
        if (customerId)
            where.customer = { id: customerId };
        if (vehicleId)
            where.vehicle = { id: vehicleId };
        if (search) {
            where.ticketNumber = (0, typeorm_2.Like)(`%${search}%`);
        }
        options.where = where;
        return this.serviceRequestRepository.find(options);
    }
    async findOne(id) {
        const serviceRequest = await this.serviceRequestRepository.findOne({
            where: { id },
            relations: [
                'customer',
                'vehicle',
                'assignedTechnician',
                'partsUsed',
                'partsUsed.part',
                'timeLogs',
                'timeLogs.technician',
            ],
        });
        if (!serviceRequest) {
            throw new common_1.NotFoundException(`Service request with ID ${id} not found`);
        }
        return serviceRequest;
    }
    async update(id, updateDto) {
        const serviceRequest = await this.findOne(id);
        if (updateDto.assignedTechnicianId) {
            const technician = await this.userRepository.findOneBy({
                id: updateDto.assignedTechnicianId,
            });
            if (!technician) {
                throw new common_1.NotFoundException('Technician not found');
            }
            serviceRequest.assignedTechnician = technician;
        }
        Object.assign(serviceRequest, updateDto);
        if (updateDto.status === request_status_enum_1.RequestStatus.COMPLETED) {
            serviceRequest.completedAt = new Date();
        }
        return this.serviceRequestRepository.save(serviceRequest);
    }
    async updateApprovalStatus(id, approvalDto) {
        const serviceRequest = await this.findOne(id);
        serviceRequest.manufacturerApprovalStatus = approvalDto.status;
        serviceRequest.manufacturerApprovalNotes = approvalDto.notes;
        if (approvalDto.status === request_status_enum_1.RequestStatus.APPROVED) {
            serviceRequest.status = request_status_enum_1.RequestStatus.APPROVED;
        }
        else if (approvalDto.status === request_status_enum_1.RequestStatus.REJECTED) {
            serviceRequest.status = request_status_enum_1.RequestStatus.REJECTED;
        }
        return this.serviceRequestRepository.save(serviceRequest);
    }
    async addPartToRequest(id, addPartDto) {
        const serviceRequest = await this.findOne(id);
        const inventoryPart = await this.inventoryRepository.findOneBy({
            id: addPartDto.partId,
        });
        if (!inventoryPart) {
            throw new common_1.NotFoundException('Inventory part not found');
        }
        if (inventoryPart.quantityOnHand < addPartDto.quantityUsed) {
            throw new common_1.BadRequestException('Insufficient inventory quantity');
        }
        const partUsed = this.partUsedRepository.create({
            serviceRequest,
            part: inventoryPart,
            quantityUsed: addPartDto.quantityUsed,
        });
        inventoryPart.quantityOnHand -= addPartDto.quantityUsed;
        await this.inventoryRepository.save(inventoryPart);
        return this.partUsedRepository.save(partUsed);
    }
    async findByTicketNumber(ticketNumber) {
        const serviceRequest = await this.serviceRequestRepository.findOne({
            where: { ticketNumber },
            relations: ['customer', 'vehicle', 'assignedTechnician'],
        });
        if (!serviceRequest) {
            throw new common_1.NotFoundException(`Service request with ticket number ${ticketNumber} not found`);
        }
        return serviceRequest;
    }
    async findAllPublic() {
        return this.serviceRequestRepository.find();
    }
    async findPendingApprovals() {
        return this.serviceRequestRepository.find({
            where: {
                isWarrantyEligible: true,
                manufacturerApprovalStatus: request_status_enum_1.RequestStatus.NEW,
            },
            relations: ['customer', 'vehicle', 'partsUsed'],
            order: { createdAt: 'ASC' },
        });
    }
    async _generateTicketNumber() {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        const datePrefix = `${year}${month}${day}`;
        const todayStart = new Date(today.setHours(0, 0, 0, 0));
        const countToday = await this.serviceRequestRepository.count({
            where: { createdAt: (0, typeorm_3.MoreThanOrEqual)(todayStart) },
        });
        const sequence = (countToday + 1).toString().padStart(3, '0');
        return `SR-${datePrefix}-${sequence}`;
    }
};
exports.ServiceRequestsService = ServiceRequestsService;
exports.ServiceRequestsService = ServiceRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(service_request_entity_1.ServiceRequest)),
    __param(1, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __param(2, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(service_request_part_used_entity_1.ServiceRequestPartUsed)),
    __param(5, (0, typeorm_1.InjectRepository)(inventory_part_entity_1.InventoryPart)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ServiceRequestsService);
//# sourceMappingURL=service-requests.service.js.map