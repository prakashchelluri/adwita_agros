"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobSheetsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const job_sheet_entity_1 = require("./job-sheet.entity");
const job_sheets_service_1 = require("./job-sheets.service");
const job_sheets_controller_1 = require("./job-sheets.controller");
const users_module_1 = require("../users/users.module");
const service_requests_module_1 = require("../service-requests/service-requests.module");
let JobSheetsModule = class JobSheetsModule {
};
exports.JobSheetsModule = JobSheetsModule;
exports.JobSheetsModule = JobSheetsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([job_sheet_entity_1.JobSheet]),
            users_module_1.UsersModule,
            service_requests_module_1.ServiceRequestsModule,
        ],
        providers: [job_sheets_service_1.JobSheetsService],
        controllers: [job_sheets_controller_1.JobSheetsController],
    })
], JobSheetsModule);
//# sourceMappingURL=job-sheets.module.js.map