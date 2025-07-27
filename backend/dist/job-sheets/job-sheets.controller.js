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
exports.JobSheetsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../common/roles.guard");
const roles_decorator_1 = require("../common/roles.decorator");
const user_role_enum_1 = require("../users/user-role.enum");
const job_sheets_service_1 = require("./job-sheets.service");
const create_job_sheet_dto_1 = require("./create-job-sheet.dto");
const get_user_decorator_1 = require("../common/get-user.decorator");
const user_entity_1 = require("../users/user.entity");
let JobSheetsController = class JobSheetsController {
    constructor(jobSheetsService) {
        this.jobSheetsService = jobSheetsService;
    }
    create(createDto, supervisor) {
        return this.jobSheetsService.create(createDto, supervisor);
    }
    findAll() {
        return this.jobSheetsService.findAll();
    }
};
exports.JobSheetsController = JobSheetsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPERVISOR),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_job_sheet_dto_1.CreateJobSheetDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], JobSheetsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPERVISOR),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JobSheetsController.prototype, "findAll", null);
exports.JobSheetsController = JobSheetsController = __decorate([
    (0, common_1.Controller)('job-sheets'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [job_sheets_service_1.JobSheetsService])
], JobSheetsController);
//# sourceMappingURL=job-sheets.controller.js.map