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
let ServiceRequestsService = class ServiceRequestsService {
    constructor(serviceRequestRepository) {
        this.serviceRequestRepository = serviceRequestRepository;
    }
    async create(createServiceRequestDto) {
        if (!createServiceRequestDto.ticketNumber) {
            createServiceRequestDto.ticketNumber = await this.generateTicketNumber();
        }
        const serviceRequest = this.serviceRequestRepository.create(createServiceRequestDto);
        return this.serviceRequestRepository.save(serviceRequest);
    }
    async generateTicketNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `SR-${year}${month}${day}-${random}`;
    }
    async findAll(query) {
        const { status, type, isWarrantyEligible, assignedTechnicianId, customerId, vehicleId, search, page = 1, limit = 20 } = query;
        const qb = this.serviceRequestRepository.createQueryBuilder('request');
        qb.leftJoinAndSelect('request.customer', 'customer')
            .leftJoinAndSelect('request.vehicle', 'vehicle')
            .leftJoinAndSelect('request.assignedTechnician', 'assignedTechnician');
        if (status)
            qb.andWhere('request.status = :status', { status });
        if (type)
            qb.andWhere('request.type = :type', { type });
        if (isWarrantyEligible !== undefined)
            qb.andWhere('request.isWarrantyEligible = :isWarrantyEligible', { isWarrantyEligible });
        if (assignedTechnicianId)
            qb.andWhere('request.assignedTechnicianId = :assignedTechnicianId', { assignedTechnicianId });
        if (customerId)
            qb.andWhere('request.customerId = :customerId', { customerId });
        if (vehicleId)
            qb.andWhere('request.vehicleId = :vehicleId', { vehicleId });
        if (search) {
            qb.andWhere('(request.ticketNumber LIKE :search OR request.description LIKE :search OR customer.name LIKE :search OR vehicle.licensePlate LIKE :search)', { search: `%${search}%` });
        }
        const skip = (page - 1) * limit;
        qb.skip(skip).take(limit);
        return qb.getMany();
    }
    async findPublicRequests(query) {
        return this.serviceRequestRepository.find();
    }
    async findByTicketNumber(ticketNumber) {
        return this.serviceRequestRepository.findOne({ where: { ticketNumber } });
    }
    async findAllPublic() {
        return this.serviceRequestRepository.find({
            relations: ['customer', 'vehicle']
        });
    }
    async findOne(id) {
        const request = await this.serviceRequestRepository.findOne({
            where: { id },
            relations: ['customer', 'vehicle', 'assignedTechnician', 'partsUsed']
        });
        if (!request) {
            throw new common_1.NotFoundException(`Service request with ID ${id} not found`);
        }
        return request;
    }
    async update(id, updateServiceRequestDto) {
        const request = await this.findOne(id);
        Object.assign(request, updateServiceRequestDto);
        return this.serviceRequestRepository.save(request);
    }
    async remove(id) {
        const result = await this.serviceRequestRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Service request with ID ${id} not found`);
        }
    }
    async updateApprovalStatus(id, updateData) {
        await this.serviceRequestRepository.update(id, updateData);
        const updatedRequest = await this.serviceRequestRepository.findOne({ where: { id } });
        if (!updatedRequest) {
            throw new common_1.NotFoundException(`Service request with ID ${id} not found`);
        }
        return updatedRequest;
    }
};
exports.ServiceRequestsService = ServiceRequestsService;
exports.ServiceRequestsService = ServiceRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(service_request_entity_1.ServiceRequest)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ServiceRequestsService);
//# sourceMappingURL=service-requests.service.js.map