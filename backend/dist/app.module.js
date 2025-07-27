"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const service_requests_module_1 = require("./service-requests/service-requests.module");
const inventory_module_1 = require("./inventory/inventory.module");
const job_sheets_module_1 = require("./job-sheets/job-sheets.module");
const time_logs_module_1 = require("./time-logs/time-logs.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const user_entity_1 = require("./users/user.entity");
const customer_entity_1 = require("./customers/customer.entity");
const vehicle_entity_1 = require("./vehicles/entities/vehicle.entity");
const service_request_entity_1 = require("./service-requests/service-request.entity");
const service_request_part_used_entity_1 = require("./service-requests/service-request-part-used.entity");
const inventory_part_entity_1 = require("./inventory/inventory-part.entity");
const job_sheet_entity_1 = require("./job-sheets/job-sheet.entity");
const technician_time_log_entity_1 = require("./time-logs/technician-time-log.entity");
const customers_module_1 = require("./customers/customers.module");
const vehicles_module_1 = require("./vehicles/vehicles.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: +configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_DATABASE'),
                    entities: [
                        user_entity_1.User,
                        customer_entity_1.Customer,
                        vehicle_entity_1.Vehicle,
                        service_request_entity_1.ServiceRequest,
                        inventory_part_entity_1.InventoryPart,
                        service_request_part_used_entity_1.ServiceRequestPartUsed,
                        job_sheet_entity_1.JobSheet,
                        technician_time_log_entity_1.TechnicianTimeLog,
                    ],
                    synchronize: true,
                }),
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            service_requests_module_1.ServiceRequestsModule,
            inventory_module_1.InventoryModule,
            job_sheets_module_1.JobSheetsModule,
            time_logs_module_1.TimeLogsModule,
            dashboard_module_1.DashboardModule,
            customers_module_1.CustomersModule,
            vehicles_module_1.VehiclesModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map