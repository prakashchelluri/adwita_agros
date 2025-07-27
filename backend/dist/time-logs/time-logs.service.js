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
exports.TimeLogsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const technician_time_log_entity_1 = require("./technician-time-log.entity");
const service_requests_service_1 = require("../service-requests/service-requests.service");
let TimeLogsService = class TimeLogsService {
    constructor(timeLogRepository, serviceRequestService) {
        this.timeLogRepository = timeLogRepository;
        this.serviceRequestService = serviceRequestService;
    }
    async startLog(startDto, technician) {
        const { serviceRequestId, notes } = startDto;
        const existingLog = await this.timeLogRepository.findOneBy({
            technician: { id: technician.id },
            endTime: (0, typeorm_2.IsNull)(),
        });
        if (existingLog) {
            throw new common_1.ConflictException('You have an active time log that must be ended first.');
        }
        const serviceRequest = await this.serviceRequestService.findOne(serviceRequestId);
        const newLog = this.timeLogRepository.create({
            serviceRequest,
            technician,
            notes,
            startTime: new Date(),
        });
        return this.timeLogRepository.save(newLog);
    }
    async endLog(id, endDto, technician) {
        const timeLog = await this.timeLogRepository.findOneBy({ id });
        if (!timeLog) {
            throw new common_1.NotFoundException(`Time log with ID "${id}" not found.`);
        }
        if (timeLog.technician.id !== technician.id) {
            throw new common_1.UnauthorizedException('You can only end your own time logs.');
        }
        timeLog.endTime = new Date();
        timeLog.notes = endDto.notes ?? timeLog.notes;
        timeLog.durationMinutes = Math.round((timeLog.endTime.getTime() - timeLog.startTime.getTime()) / 60000);
        return this.timeLogRepository.save(timeLog);
    }
    async findActiveLogForTechnician(technicianId) {
        return this.timeLogRepository.findOne({
            where: {
                technician: { id: technicianId },
                endTime: (0, typeorm_2.IsNull)(),
            },
            relations: ['serviceRequest', 'serviceRequest.customer'],
        });
    }
};
exports.TimeLogsService = TimeLogsService;
exports.TimeLogsService = TimeLogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(technician_time_log_entity_1.TechnicianTimeLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        service_requests_service_1.ServiceRequestsService])
], TimeLogsService);
//# sourceMappingURL=time-logs.service.js.map