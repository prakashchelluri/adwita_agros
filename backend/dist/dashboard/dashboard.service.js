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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const date_fns_1 = require("date-fns");
const technician_time_log_entity_1 = require("../time-logs/technician-time-log.entity");
const service_request_entity_1 = require("../service-requests/service-request.entity");
let DashboardService = class DashboardService {
    constructor(timeLogRepository, serviceRequestRepository) {
        this.timeLogRepository = timeLogRepository;
        this.serviceRequestRepository = serviceRequestRepository;
    }
    async getAdminDashboardMetrics() {
        const weeklyTechnicianHours = await this.getWeeklyTechnicianHours();
        const customerComplaintsLast6Months = await this.getCustomerComplaintsLast6Months();
        const overallTicketStatusCounts = await this.getOverallTicketStatusCounts();
        return {
            weeklyTechnicianHours,
            customerComplaintsLast6Months,
            overallTicketStatusCounts,
        };
    }
    async getWeeklyTechnicianHours() {
        const today = new Date();
        const weekStart = (0, date_fns_1.startOfWeek)(today, { weekStartsOn: 1 });
        const weekEnd = (0, date_fns_1.endOfWeek)(today, { weekStartsOn: 1 });
        const result = await this.timeLogRepository
            .createQueryBuilder('timeLog')
            .select('technician.fullName', 'technicianName')
            .addSelect('SUM(timeLog.durationMinutes)', 'totalMinutes')
            .innerJoin('timeLog.technician', 'technician')
            .where('timeLog.startTime BETWEEN :weekStart AND :weekEnd', {
            weekStart,
            weekEnd,
        })
            .groupBy('technician.id')
            .orderBy('totalMinutes', 'DESC')
            .getRawMany();
        return result.map((r) => ({
            technicianName: r.technicianName,
            totalHours: parseFloat((r.totalMinutes / 60).toFixed(2)),
        }));
    }
    async getCustomerComplaintsLast6Months() {
        const sixMonthsAgo = (0, date_fns_1.subMonths)(new Date(), 6);
        return this.serviceRequestRepository
            .createQueryBuilder('sr')
            .select('customer.fullName', 'customerName')
            .addSelect('COUNT(sr.id)', 'complaintCount')
            .innerJoin('sr.customer', 'customer')
            .where('sr.createdAt > :sixMonthsAgo', { sixMonthsAgo })
            .groupBy('customer.id')
            .orderBy('complaintCount', 'DESC')
            .limit(10)
            .getRawMany();
    }
    async getOverallTicketStatusCounts() {
        return this.serviceRequestRepository
            .createQueryBuilder('sr')
            .select('sr.status', 'status')
            .addSelect('COUNT(sr.id)', 'count')
            .groupBy('sr.status')
            .getRawMany();
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(technician_time_log_entity_1.TechnicianTimeLog)),
    __param(1, (0, typeorm_1.InjectRepository)(service_request_entity_1.ServiceRequest)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map