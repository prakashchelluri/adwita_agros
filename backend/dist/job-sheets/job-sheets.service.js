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
exports.JobSheetsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_sheet_entity_1 = require("./job-sheet.entity");
const users_service_1 = require("../users/users.service");
const service_requests_service_1 = require("../service-requests/service-requests.service");
const user_role_enum_1 = require("../users/user-role.enum");
let JobSheetsService = class JobSheetsService {
    constructor(jobSheetRepository, usersService, serviceRequestsService) {
        this.jobSheetRepository = jobSheetRepository;
        this.usersService = usersService;
        this.serviceRequestsService = serviceRequestsService;
    }
    async create(createDto, supervisor) {
        const { serviceRequestId, technicianId, instructions } = createDto;
        const serviceRequest = await this.serviceRequestsService.findOne(serviceRequestId);
        const technician = await this.usersService.findOneByIdAndRole(technicianId, user_role_enum_1.UserRole.TECHNICIAN);
        const jobSheet = this.jobSheetRepository.create({
            serviceRequest,
            technician,
            supervisor,
            instructions,
        });
        await this.serviceRequestsService.update(serviceRequestId, {
            assignedTechnicianId: technician.id,
        });
        return this.jobSheetRepository.save(jobSheet);
    }
    findAll() {
        return this.jobSheetRepository.find({
            relations: ['serviceRequest', 'technician', 'supervisor'],
        });
    }
};
exports.JobSheetsService = JobSheetsService;
exports.JobSheetsService = JobSheetsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_sheet_entity_1.JobSheet)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        service_requests_service_1.ServiceRequestsService])
], JobSheetsService);
//# sourceMappingURL=job-sheets.service.js.map