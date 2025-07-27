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
exports.TimeLogsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_guard_1 = require("../common/roles.guard");
const roles_decorator_1 = require("../common/roles.decorator");
const user_role_enum_1 = require("../users/user-role.enum");
const time_logs_service_1 = require("./time-logs.service");
const get_user_decorator_1 = require("../common/get-user.decorator");
const user_entity_1 = require("../users/user.entity");
const start_time_log_dto_1 = require("./start-time-log.dto");
const end_time_log_dto_1 = require("./end-time-log.dto");
let TimeLogsController = class TimeLogsController {
    constructor(timeLogsService) {
        this.timeLogsService = timeLogsService;
    }
    findActiveLog(technician) {
        return this.timeLogsService.findActiveLogForTechnician(technician.id);
    }
    startLog(startDto, technician) {
        return this.timeLogsService.startLog(startDto, technician);
    }
    endLog(id, endDto, technician) {
        return this.timeLogsService.endLog(id, endDto, technician);
    }
};
exports.TimeLogsController = TimeLogsController;
__decorate([
    (0, common_1.Get)('active'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.TECHNICIAN),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], TimeLogsController.prototype, "findActiveLog", null);
__decorate([
    (0, common_1.Post)('start'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.TECHNICIAN),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [start_time_log_dto_1.StartTimeLogDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], TimeLogsController.prototype, "startLog", null);
__decorate([
    (0, common_1.Patch)(':id/end'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.TECHNICIAN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe())),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, end_time_log_dto_1.EndTimeLogDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], TimeLogsController.prototype, "endLog", null);
exports.TimeLogsController = TimeLogsController = __decorate([
    (0, common_1.Controller)('time-logs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [time_logs_service_1.TimeLogsService])
], TimeLogsController);
//# sourceMappingURL=time-logs.controller.js.map