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
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vehicle_entity_1 = require("./entities/vehicle.entity");
const customer_entity_1 = require("../customers/customer.entity");
let VehiclesService = class VehiclesService {
    constructor(vehicleRepository, customerRepository) {
        this.vehicleRepository = vehicleRepository;
        this.customerRepository = customerRepository;
    }
    async create(createVehicleDto) {
        const existingVehicle = await this.vehicleRepository.findOneBy({
            chassisNumber: createVehicleDto.chassisNumber,
        });
        if (existingVehicle) {
            throw new common_1.ConflictException('Vehicle with this chassis number already exists');
        }
        const customer = await this.customerRepository.findOneBy({
            id: createVehicleDto.customerId,
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        const vehicle = this.vehicleRepository.create({
            ...createVehicleDto,
            purchaseDate: new Date(createVehicleDto.purchaseDate),
            customer,
        });
        return this.vehicleRepository.save(vehicle);
    }
    async findAll() {
        return this.vehicleRepository.find({
            relations: ['customer'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const vehicle = await this.vehicleRepository.findOne({
            where: { id },
            relations: ['customer', 'serviceRequests'],
        });
        if (!vehicle) {
            throw new common_1.NotFoundException(`Vehicle with ID ${id} not found`);
        }
        return vehicle;
    }
    async findOneByChassisNumber(chassisNumber) {
        const vehicle = await this.vehicleRepository.findOne({
            where: { chassisNumber },
            relations: ['customer'],
        });
        if (!vehicle) {
            throw new common_1.NotFoundException(`Vehicle with chassis number ${chassisNumber} not found`);
        }
        return vehicle;
    }
    async findByCustomerId(customerId) {
        return this.vehicleRepository.find({
            where: { customer: { id: customerId } },
            relations: ['customer'],
            order: { createdAt: 'DESC' },
        });
    }
    async update(id, updateVehicleDto) {
        const vehicle = await this.findOne(id);
        if (updateVehicleDto.chassisNumber && updateVehicleDto.chassisNumber !== vehicle.chassisNumber) {
            const existingVehicle = await this.vehicleRepository.findOneBy({
                chassisNumber: updateVehicleDto.chassisNumber,
            });
            if (existingVehicle) {
                throw new common_1.ConflictException('Vehicle with this chassis number already exists');
            }
        }
        if (updateVehicleDto.customerId) {
            const customer = await this.customerRepository.findOneBy({
                id: updateVehicleDto.customerId,
            });
            if (!customer) {
                throw new common_1.NotFoundException('Customer not found');
            }
            vehicle.customer = customer;
        }
        Object.assign(vehicle, {
            ...updateVehicleDto,
            purchaseDate: updateVehicleDto.purchaseDate
                ? new Date(updateVehicleDto.purchaseDate)
                : vehicle.purchaseDate,
        });
        return this.vehicleRepository.save(vehicle);
    }
    async remove(id) {
        const vehicle = await this.findOne(id);
        await this.vehicleRepository.remove(vehicle);
    }
    async checkWarrantyStatus(id) {
        const vehicle = await this.findOne(id);
        const warrantyEndDate = new Date(vehicle.purchaseDate);
        warrantyEndDate.setMonth(warrantyEndDate.getMonth() + vehicle.warrantyPeriodMonths);
        const today = new Date();
        const isUnderWarranty = vehicle.isWarrantyActive && today <= warrantyEndDate;
        const daysRemaining = Math.max(0, Math.ceil((warrantyEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
        return {
            isUnderWarranty,
            warrantyEndDate,
            daysRemaining,
        };
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __param(1, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map