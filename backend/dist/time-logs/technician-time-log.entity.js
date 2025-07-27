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
exports.TechnicianTimeLog = void 0;
const typeorm_1 = require("typeorm");
let TechnicianTimeLog = class TechnicianTimeLog {
};
exports.TechnicianTimeLog = TechnicianTimeLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TechnicianTimeLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('ServiceRequest', { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'service_request_id' }),
    __metadata("design:type", Object)
], TechnicianTimeLog.prototype, "serviceRequest", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('User'),
    (0, typeorm_1.JoinColumn)({ name: 'technician_id' }),
    __metadata("design:type", Object)
], TechnicianTimeLog.prototype, "technician", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_time', type: 'timestamptz' }),
    __metadata("design:type", Date)
], TechnicianTimeLog.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_time', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], TechnicianTimeLog.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TechnicianTimeLog.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'duration_minutes', type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], TechnicianTimeLog.prototype, "durationMinutes", void 0);
exports.TechnicianTimeLog = TechnicianTimeLog = __decorate([
    (0, typeorm_1.Entity)('technician_time_logs')
], TechnicianTimeLog);
//# sourceMappingURL=technician-time-log.entity.js.map