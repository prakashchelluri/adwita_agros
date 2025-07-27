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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = void 0;
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("../../customers/customer.entity");
const service_request_entity_1 = require("../../service-requests/service-request.entity");
let Vehicle = class Vehicle {
    isUnderWarranty() {
        if (!this.isWarrantyActive)
            return false;
        const warrantyEndDate = new Date(this.purchaseDate);
        warrantyEndDate.setMonth(warrantyEndDate.getMonth() + this.warrantyPeriodMonths);
        return new Date() <= warrantyEndDate;
    }
};
exports.Vehicle = Vehicle;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Vehicle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'chassis_number', unique: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "chassisNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'engine_number', nullable: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "engineNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'model_name', nullable: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "modelName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_date', type: 'date' }),
    __metadata("design:type", Date)
], Vehicle.prototype, "purchaseDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'invoice_number', nullable: true }),
    __metadata("design:type", String)
], Vehicle.prototype, "invoiceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warranty_period_months', default: 12 }),
    __metadata("design:type", Number)
], Vehicle.prototype, "warrantyPeriodMonths", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_warranty_active', default: true }),
    __metadata("design:type", Boolean)
], Vehicle.prototype, "isWarrantyActive", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.Customer, (customer) => customer.vehicles, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_entity_1.Customer)
], Vehicle.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => service_request_entity_1.ServiceRequest, (request) => request.vehicle),
    __metadata("design:type", Array)
], Vehicle.prototype, "serviceRequests", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Vehicle.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Vehicle.prototype, "updatedAt", void 0);
exports.Vehicle = Vehicle = __decorate([
    (0, typeorm_1.Entity)('vehicles')
], Vehicle);
//# sourceMappingURL=vehicle.entity.js.map