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
exports.ServiceRequestsController = void 0;
const common_1 = require("@nestjs/common");
const service_requests_service_1 = require("./service-requests.service");
const create_service_request_dto_1 = require("./dto/create-service-request.dto");
const update_service_request_dto_1 = require("./dto/update-service-request.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/roles.guard");
const roles_decorator_1 = require("../common/roles.decorator");
const user_role_enum_1 = require("../common/enums/user-role.enum");
const query_service_request_dto_1 = require("./dto/query-service-request.dto");
const request_status_enum_1 = require("../common/enums/request-status.enum");
const update_approval_status_dto_1 = require("./dto/update-approval-status.dto");
let ServiceRequestsController = class ServiceRequestsController {
    constructor(serviceRequestsService) {
        this.serviceRequestsService = serviceRequestsService;
    }
    create(createServiceRequestDto) {
        return this.serviceRequestsService.create(createServiceRequestDto);
    }
    findAll(query) {
        return this.serviceRequestsService.findAll(query);
    }
    findOne(id) {
        return this.serviceRequestsService.findOne(+id);
    }
    update(id, updateServiceRequestDto) {
        return this.serviceRequestsService.update(+id, updateServiceRequestDto);
    }
    remove(id) {
        return this.serviceRequestsService.remove(+id);
    }
    async sendForApproval(id) {
        await this.serviceRequestsService.updateApprovalStatus(+id, {
            status: request_status_enum_1.RequestStatus.AWAITING_APPROVAL,
        });
        console.log(`Sent request ${id} to manufacturer for approval`);
        return { message: 'Request sent to manufacturer for approval' };
    }
    updateApprovalStatus(id, updateApprovalStatusDto) {
        return this.serviceRequestsService.updateApprovalStatus(+id, updateApprovalStatusDto);
    }
};
exports.ServiceRequestsController = ServiceRequestsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.OPERATOR, user_role_enum_1.UserRole.SUPERVISOR),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_service_request_dto_1.CreateServiceRequestDto]),
    __metadata("design:returntype", void 0)
], ServiceRequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.OPERATOR, user_role_enum_1.UserRole.TECHNICIAN),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_service_request_dto_1.QueryServiceRequestDto]),
    __metadata("design:returntype", void 0)
], ServiceRequestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.OPERATOR, user_role_enum_1.UserRole.TECHNICIAN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceRequestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.OPERATOR),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_service_request_dto_1.UpdateServiceRequestDto]),
    __metadata("design:returntype", void 0)
], ServiceRequestsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceRequestsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/send-for-approval'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERVISOR, user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ServiceRequestsController.prototype, "sendForApproval", null);
__decorate([
    (0, common_1.Patch)(':id/approval'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.MANUFACTURER, user_role_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_approval_status_dto_1.UpdateApprovalStatusDto]),
    __metadata("design:returntype", void 0)
], ServiceRequestsController.prototype, "updateApprovalStatus", null);
exports.ServiceRequestsController = ServiceRequestsController = __decorate([
    (0, common_1.Controller)('service-requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [service_requests_service_1.ServiceRequestsService])
], ServiceRequestsController);
//# sourceMappingURL=service-requests.controller.js.map