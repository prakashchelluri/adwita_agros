import { Repository } from 'typeorm';
import { TechnicianTimeLog } from '../time-logs/technician-time-log.entity';
import { ServiceRequest } from '../service-requests/service-request.entity';
export declare class DashboardService {
    private readonly timeLogRepository;
    private readonly serviceRequestRepository;
    constructor(timeLogRepository: Repository<TechnicianTimeLog>, serviceRequestRepository: Repository<ServiceRequest>);
    getAdminDashboardMetrics(): Promise<{
        weeklyTechnicianHours: {
            technicianName: any;
            totalHours: number;
        }[];
        customerComplaintsLast6Months: any[];
        overallTicketStatusCounts: any[];
    }>;
    private getWeeklyTechnicianHours;
    private getCustomerComplaintsLast6Months;
    private getOverallTicketStatusCounts;
}
