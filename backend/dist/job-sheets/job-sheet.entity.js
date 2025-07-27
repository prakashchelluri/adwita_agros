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
exports.JobSheet = void 0;
const typeorm_1 = require("typeorm");
let JobSheet = class JobSheet {
};
exports.JobSheet = JobSheet;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], JobSheet.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)('ServiceRequest', { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'service_request_id' }),
    __metadata("design:type", Object)
], JobSheet.prototype, "serviceRequest", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User'),
    (0, typeorm_1.JoinColumn)({ name: 'supervisor_id' }),
    __metadata("design:type", Object)
], JobSheet.prototype, "supervisor", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User'),
    (0, typeorm_1.JoinColumn)({ name: 'technician_id' }),
    __metadata("design:type", Object)
], JobSheet.prototype, "technician", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], JobSheet.prototype, "instructions", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], JobSheet.prototype, "createdAt", void 0);
exports.JobSheet = JobSheet = __decorate([
    (0, typeorm_1.Entity)('job_sheets')
], JobSheet);
//# sourceMappingURL=job-sheet.entity.js.map