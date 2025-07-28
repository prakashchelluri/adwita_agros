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
exports.PublicServiceRequestController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const service_requests_service_1 = require("./service-requests.service");
const create_service_request_dto_1 = require("./dto/create-service-request.dto");
const vehicles_service_1 = require("../vehicles/vehicles.service");
const customers_service_1 = require("../customers/customers.service");
let PublicServiceRequestController = class PublicServiceRequestController {
    constructor(serviceRequestsService, vehiclesService, customersService) {
        this.serviceRequestsService = serviceRequestsService;
        this.vehiclesService = vehiclesService;
        this.customersService = customersService;
    }
    async createPublicRequest(createDto, files) {
        const mediaUrls = [];
        if (files && files.length > 0) {
            mediaUrls.push(...files.map(file => `/uploads/${file.filename}`));
        }
        createDto.mediaUrls = [...(createDto.mediaUrls || []), ...mediaUrls];
        if (createDto.chassisNumber) {
            const vehicle = await this.vehiclesService.findOneByChassisNumber(createDto.chassisNumber);
            if (vehicle) {
                createDto.vehicleId = vehicle.id;
                if (vehicle.customer) {
                    createDto.customerName = vehicle.customer.fullName;
                    createDto.customerPhone = vehicle.customer.primaryPhone;
                }
                const warrantyStatus = await this.vehiclesService.checkWarrantyStatus(vehicle.id);
                createDto.isWarrantyEligible = warrantyStatus.isUnderWarranty;
            }
        }
        const serviceRequest = await this.serviceRequestsService.create(createDto);
        return {
            success: true,
            ticketNumber: serviceRequest.ticketNumber,
            message: 'Service request created successfully',
            warrantyStatus: serviceRequest.isWarrantyEligible ? 'Valid' : 'Expired',
        };
    }
    async checkVehicle(chassisNumber) {
        try {
            const vehicle = await this.vehiclesService.findOneByChassisNumber(chassisNumber);
            const warrantyStatus = await this.vehiclesService.checkWarrantyStatus(vehicle.id);
            return {
                found: true,
                vehicle: {
                    chassisNumber: vehicle.chassisNumber,
                    modelName: vehicle.modelName,
                    purchaseDate: vehicle.purchaseDate,
                },
                customer: {
                    name: vehicle.customer.fullName,
                    phone: vehicle.customer.primaryPhone,
                },
                warranty: {
                    isUnderWarranty: warrantyStatus.isUnderWarranty,
                    warrantyEndDate: warrantyStatus.warrantyEndDate,
                    daysRemaining: warrantyStatus.daysRemaining,
                },
            };
        }
        catch (error) {
            return {
                found: false,
                message: 'Vehicle not found in our records',
            };
        }
    }
    async getRequestStatus(ticketNumber) {
        try {
            const serviceRequest = await this.serviceRequestsService.findByTicketNumber(ticketNumber);
            return {
                found: true,
                ticketNumber: serviceRequest.ticketNumber,
                status: serviceRequest.status,
                type: serviceRequest.type,
                createdAt: serviceRequest.createdAt,
                assignedTechnician: serviceRequest.assignedTechnician?.fullName || null,
                manufacturerApprovalStatus: serviceRequest.manufacturerApprovalStatus,
                isWarrantyEligible: serviceRequest.isWarrantyEligible,
            };
        }
        catch (error) {
            return {
                found: false,
                message: 'Service request not found',
            };
        }
    }
    async getAllPublicRequests() {
        try {
            const requests = await this.serviceRequestsService.findAllPublic();
            return {
                success: true,
                data: requests,
            };
        }
        catch (error) {
            return {
                success: false,
                message: 'Failed to fetch public service requests',
            };
        }
    }
};
exports.PublicServiceRequestController = PublicServiceRequestController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('media', 10)),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_service_request_dto_1.CreateServiceRequestDto, Array]),
    __metadata("design:returntype", Promise)
], PublicServiceRequestController.prototype, "createPublicRequest", null);
__decorate([
    (0, common_1.Get)('check-vehicle/:chassisNumber'),
    __param(0, (0, common_1.Param)('chassisNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicServiceRequestController.prototype, "checkVehicle", null);
__decorate([
    (0, common_1.Get)('status/:ticketNumber'),
    __param(0, (0, common_1.Param)('ticketNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicServiceRequestController.prototype, "getRequestStatus", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicServiceRequestController.prototype, "getAllPublicRequests", null);
exports.PublicServiceRequestController = PublicServiceRequestController = __decorate([
    (0, common_1.Controller)('public/service-requests'),
    __metadata("design:paramtypes", [service_requests_service_1.ServiceRequestsService,
        vehicles_service_1.VehiclesService,
        customers_service_1.CustomersService])
], PublicServiceRequestController);
//# sourceMappingURL=public-service-request.controller.js.map