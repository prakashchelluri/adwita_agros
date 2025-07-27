"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeLogsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const technician_time_log_entity_1 = require("./technician-time-log.entity");
const time_logs_service_1 = require("./time-logs.service");
const time_logs_controller_1 = require("./time-logs.controller");
const service_requests_module_1 = require("../service-requests/service-requests.module");
let TimeLogsModule = class TimeLogsModule {
};
exports.TimeLogsModule = TimeLogsModule;
exports.TimeLogsModule = TimeLogsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([technician_time_log_entity_1.TechnicianTimeLog]), service_requests_module_1.ServiceRequestsModule],
        providers: [time_logs_service_1.TimeLogsService],
        controllers: [time_logs_controller_1.TimeLogsController],
    })
], TimeLogsModule);
//# sourceMappingURL=time-logs.module.js.map