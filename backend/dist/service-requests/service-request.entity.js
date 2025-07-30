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
exports.ServiceRequest = exports.RequestType = exports.RequestStatus = void 0;
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("../customers/customer.entity");
const vehicle_entity_1 = require("../vehicles/entities/vehicle.entity");
const service_request_part_used_entity_1 = require("./service-request-part-used.entity");
const user_entity_1 = require("../users/user.entity");
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["NEW"] = "new";
    RequestStatus["AWAITING_APPROVAL"] = "awaiting_approval";
    RequestStatus["APPROVED"] = "approved";
    RequestStatus["REJECTED"] = "rejected";
    RequestStatus["IN_PROGRESS"] = "in_progress";
    RequestStatus["PARTS_ORDERED"] = "parts_ordered";
    RequestStatus["PARTS_RECEIVED"] = "parts_received";
    RequestStatus["COMPLETED"] = "completed";
    RequestStatus["CLOSED"] = "closed";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
var RequestType;
(function (RequestType) {
    RequestType["OIL_CHANGE_SERVICE"] = "oil_change_service";
    RequestType["VEHICLE_BREAKDOWN"] = "vehicle_breakdown";
    RequestType["WARRANTY_CLAIM"] = "warranty_claim";
    RequestType["OTHER"] = "other";
})(RequestType || (exports.RequestType = RequestType = {}));
let ServiceRequest = class ServiceRequest {
};
exports.ServiceRequest = ServiceRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ServiceRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ticket_number', unique: true }),
    __metadata("design:type", String)
], ServiceRequest.prototype, "ticketNumber", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Customer', { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_entity_1.Customer)
], ServiceRequest.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Vehicle', { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'vehicle_id' }),
    __metadata("design:type", vehicle_entity_1.Vehicle)
], ServiceRequest.prototype, "vehicle", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => service_request_part_used_entity_1.ServiceRequestPartUsed, (partUsed) => partUsed.serviceRequest, { eager: true, cascade: true }),
    __metadata("design:type", Array)
], ServiceRequest.prototype, "partsUsed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: RequestType }),
    __metadata("design:type", String)
], ServiceRequest.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'issue_description', type: 'text' }),
    __metadata("design:type", String)
], ServiceRequest.prototype, "issueDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_location', nullable: true }),
    __metadata("design:type", String)
], ServiceRequest.prototype, "customerLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'media_urls', type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], ServiceRequest.prototype, "mediaUrls", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: RequestStatus, default: RequestStatus.NEW }),
    __metadata("design:type", String)
], ServiceRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_warranty_eligible', default: false }),
    __metadata("design:type", Boolean)
], ServiceRequest.prototype, "isWarrantyEligible", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'manufacturer_approval_status', type: 'enum', enum: RequestStatus, default: RequestStatus.NEW }),
    __metadata("design:type", String)
], ServiceRequest.prototype, "manufacturerApprovalStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'manufacturer_approval_notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ServiceRequest.prototype, "manufacturerApprovalNotes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User', { nullable: true, eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assigned_technician_id' }),
    __metadata("design:type", user_entity_1.User)
], ServiceRequest.prototype, "assignedTechnician", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ServiceRequest.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ServiceRequest.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completed_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], ServiceRequest.prototype, "completedAt", void 0);
exports.ServiceRequest = ServiceRequest = __decorate([
    (0, typeorm_1.Entity)('service_requests')
], ServiceRequest);
//# sourceMappingURL=service-request.entity.js.map